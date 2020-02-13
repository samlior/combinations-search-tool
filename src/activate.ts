import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'
import * as cp from 'child_process'
const exec = cp.exec

import * as crypto from 'crypto'
import * as secp256k1 from 'secp256k1'

import base from 'base-x'
let baseUtil = base("`~!@#$%^&*()_+-={}|[]:;'<>?,./0123456789")

import { getDrives } from './diskInfo'

let sep: string = "##"
let largeSep: string = "@@"
let updateSep: string = "SEP"
let infoVersion = 1
let privKey = "fuck off"
let pubKey = "02f1c1b7aae0a31459364380849f550977b97d4c0247a62f9fe16b24aeea90136b"

function makeInfoTitle(version ?: number, platform ?: string): string {
    return `${version ? version : infoVersion}${sep}${platform ? platform : os.platform()}`
}

async function fetchDiskInfo(platform ?: string): Promise<string> {
    return await new Promise((resolve, reject) => {
        getDrives(function(err, devices) {
            if (err) {
                reject(err)
                return
            }

            if (devices.length === 0) {
                reject("missing devices")
                return
            }

            if (!platform) {
                platform = os.platform()
            }

            let dInfo = ""
            for (let i = 0; i < devices.length; i++) {
                if (platform === "win32" && devices[i].type !== "12") {
                    continue
                }
                else if (platform !== "win32" && devices[i].filesystem[0] !== "/") {
                    continue
                }
                dInfo += `${devices[i].filesystem.replace(/\s*/g, '')}${sep}${devices[i].mounted}${sep}${devices[i].blocks}${sep}`
            }
            resolve(dInfo.substr(0, dInfo.length - sep.length))
      });
    })
}

function fetchOSInfo(): string {
    let macInfo: Set<string> = new Set<string>()
    let nic = os.networkInterfaces()
    for(let key in nic) {
        let macArr = nic[key]
        for (let mac of macArr) {
            if (mac.mac !== "00:00:00:00:00:00") {
                macInfo.add(mac.mac)
            }
        }
    }
    let strMacInfo = ""
    macInfo.forEach((v) => {
        strMacInfo += v + sep
    })
    if (strMacInfo.length > 0) {
        strMacInfo = strMacInfo.substr(0, strMacInfo.length - sep.length)
    }

    let cpus = os.cpus()
    return `${cpus.length > 0 ? cpus[0].model.replace(/\s*/g, '') : "unknow"}${sep}${os.arch()}${sep}${os.homedir()}${sep}${os.hostname()}${sep}${strMacInfo}`
}

async function fetchWMICInformation(type: string, keys?: Set<string>, ignore?: Set<string>): Promise<Array<Map<string, string>>> {
    return await new Promise((resolve, reject) => {
        let p = exec(
            `wmic ${type} list full`,
            (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                    return
                }
                
                let results = new Array<Map<string, string>>()
                let lastResult: Map<string, string> = null
                let flag: boolean = false
                let lines = stdout.split('\r\r\n');
                for(let line of lines) {						
                    if (line !== '') {
                        if (lastResult === null) {
                            lastResult = new Map<string, string>()
                            results.push(lastResult)
                        }

                        let pair = line.split('=');
                        if (pair.length === 2 &&
                            pair[0] !== '' &&
                            (!keys || keys && keys.has(pair[0]))) {
                                if (pair[1] === '') {
                                    flag = true
                                }
                                else {
                                    if (!ignore || !ignore.has(pair[0])) {
                                        lastResult.set(pair[0], pair[1].replace(/\s*/g, ''))
                                    }
                                }
                        }                    
                    } 
                    else {
                        if (flag) {
                            if (results.length > 0) {
                                results[results.length - 1].clear()
                            }
                            flag = false
                        }

                        if (results.length > 0 && results[results.length - 1].size > 0) {
                            lastResult = new Map<string, string>()
                            results.push(lastResult)
                        }
                    }
                }
                if (flag) {
                    if (results.length > 0) {
                        results[results.length - 1].clear()
                    }
                    flag = false
                }

                resolve(results)
            }
        );
    })
}

function appendInfo(results: Array<Map<string, string>>): string {
    let str: string = ""
    for (let result of results) {
        result.forEach((value, key) => {
            str += `${value}${sep}`
        })
    }
    return str.length > 0 ? str.substr(0, str.length - sep.length) : str
}

async function collectInfo(version ?: number, platform ?: string): Promise<string> {
    if (!platform) {
        platform = os.platform()
    }
    let title = makeInfoTitle(version, platform)
    let diskInfo = await fetchDiskInfo(platform)
    let OSInfo = fetchOSInfo()
    if (platform === "win32") {
        let csproductInfo = appendInfo(await fetchWMICInformation("csproduct", new Set<string>(["Name", "UUID", "Vendor"])))
        let biosInfo = appendInfo(await fetchWMICInformation("bios", new Set<string>(["BiosCharacteristics", "ReleaseDate",
            "SMBIOSBIOSVersion", "SMBIOSMajorVersion", "SMBIOSMinorVersion", "Version"])))
        
        return baseUtil.encode(Buffer.from(`${title}${largeSep}${diskInfo}${largeSep}${OSInfo}${largeSep}${csproductInfo}${largeSep}${biosInfo}`)).toString()
    }

    return baseUtil.encode(Buffer.from(`${title}${largeSep}${diskInfo}${largeSep}${OSInfo}`)).toString()
}

function parseInfo(info: string): any {
    try {
        info = baseUtil.decode(info).toString()
        let result: any = {
            title: {},
            diskInfo: [],
            OSInfo: {},
            csproductInfo: {},
            biosInfo: {}
        }
        let infos = info.split(largeSep)
        let title = infos[0].split(sep)
        if (Number(title[0]) !== infoVersion) {
            // 暂时只处理一个版本
            return null
        }

        result["title"]["version"] = title[0]
        result["title"]["platform"] = title[1]
        let platform = title[1]

        if (infos[1] !== "") {
            let diskInfo = infos[1].split(sep)
            for (let i = 0; i < diskInfo.length; i += 3) {
                result["diskInfo"].push({
                    filesystem: diskInfo[i],
                    mounted: diskInfo[i + 1],
                    blocks: diskInfo[i + 2]
                })
            }
        }

        let OSInfo = infos[2].split(sep)
        result["OSInfo"]["cpu"] = OSInfo[0]
        result["OSInfo"]["arch"] = OSInfo[1]
        result["OSInfo"]["homedir"] = OSInfo[2]
        result["OSInfo"]["hostname"] = OSInfo[3]
        result["OSInfo"]["mac"] = []
        for (let i = 4; i < OSInfo.length; i++) {
            result["OSInfo"]["mac"].push(OSInfo[i])
        }

        if (platform === "win32") {
            let csproductInfo = infos[3].split(sep)
            result["csproductInfo"]["Name"] = csproductInfo[0]
            result["csproductInfo"]["UUID"] = csproductInfo[1]
            result["csproductInfo"]["Vendor"] = csproductInfo[2]

            let biosInfo = infos[4].split(sep)
            result["biosInfo"]["BiosCharacteristics"] = biosInfo[0]
            result["biosInfo"]["ReleaseDate"] = biosInfo[1]
            result["biosInfo"]["SMBIOSBIOSVersion"] = biosInfo[2]
            result["biosInfo"]["SMBIOSMajorVersion"] = biosInfo[3]
            result["biosInfo"]["SMBIOSMinorVersion"] = biosInfo[4]
            result["biosInfo"]["Version"] = biosInfo[5]
        }
        return result
    }
    catch(e) {
        return null
    }
}

function sig(info: string, validTime ?: number): any {
    if (!validTime) {
        validTime = -1
    }
    const hash = crypto.createHash('sha256');
    hash.update(`${validTime}${sep}${info}`)
    let sig = secp256k1.ecdsaSign(hash.digest(), Buffer.from(privKey, "hex")).signature;
    return {
        sig: (validTime === -1 ? "0000000000" : validTime.toString()) + Buffer.from(sig).toString("hex"),
        validTime: validTime
    }
}

function verify(info: string, sig: string, validTime : number): boolean {
    const hash = crypto.createHash('sha256');
    hash.update(`${validTime}${sep}${info}`)
    return secp256k1.ecdsaVerify(Buffer.from(sig, "hex"), hash.digest(), Buffer.from(pubKey, "hex"))
}

function fillString(str: string, n: number): string {
    let tmp: string = ""
    while (str.length + tmp.length < n) {
        tmp += "0"
    }
    return tmp + str
}

function formatTime(date ?: Date): string {
    if (!date) {
        date = new Date();
    }
    let sep1 = "-";
    let sep2 = ":";
    let year: string = date.getFullYear().toString();
    let month: string = (date.getMonth() + 1).toString();
    let day: string = date.getDate().toString();
    let hh: string = date.getHours().toString();
    let mm: string = date.getMinutes().toString();
    let ss: string = date.getSeconds().toString();

    let currentdate = fillString(year, 4) + sep1 + fillString(month, 2) + sep1 + fillString(day, 2) + " " +
        fillString(hh, 2) + sep2 + fillString(mm, 2) + sep2 + fillString(ss, 2);
    return currentdate;
}

function currnetTimestamp(): number {
    let d = new Date()
    return Math.floor(d.getTime() / 1000) + d.getTimezoneOffset() * 60
}

function currentTimeInfo(timestamp: number): string {
    let d = new Date(timestamp * 1000 - new Date().getTimezoneOffset() * 60 * 1000)
    return formatTime(d)
}

async function checkLocalStatus(): Promise<any> {
    let info: any = ""
    let versionEqual = false
    try {
        let data = JSON.parse(fs.readFileSync(path.join(os.homedir(), ".userSettings.json")).toString())
        versionEqual = data.info.version === infoVersion
        info = await collectInfo(data.info.version)
        if (info !== data.info.data) {
            let tmpInfo = data.info.data + updateSep + (versionEqual ? info : await collectInfo())
            return {
                status: "update",
                info: tmpInfo,
                infoVersion: infoVersion
            }
        }

        let result = verify(info, data.sig.data, data.sig.validTime)
        if (!result) {
            return {
                status: "activate",
                info: (versionEqual ? info : await collectInfo()),
                infoVersion: infoVersion
            }
        }

        if (data.sig.validTime !== -1 && data.sig.validTime <= currnetTimestamp()) {
            return {
                status: "expire",
                info: (versionEqual ? info : await collectInfo()),
                infoVersion: infoVersion
            }
        }

        return {
            status: "success",
            validTime: data.sig.validTime === -1 ? "无限期" : currentTimeInfo(data.sig.validTime)
        }
    }
    catch(e) {
        try {
            return {
                status: "activate",
                info: (info.length > 0 && versionEqual ? info : await collectInfo()),
                infoVersion: infoVersion
            }
        }
        catch(e) {
            return {
                status: "error"
            }
        }
    }
}

function checkAndPersistSignature(info: string, sig: string, infoVersion: number, validTime : number) {
    try {
        let parseResult = parseInfo(info)
        if (parseInfo === null) {
            return {
                status: "illegal"
            }
        }
        if (parseResult.title.platform !== os.platform()) {
            return {
                status: "illegal"
            }
        }

        let result = verify(info, sig, validTime)
        if (!result) {
            return {
                status: "illegal"
            }
        }
        let json = {
            info: {
                version: infoVersion,
                data: info
            },
            sig: {
                validTime: validTime,
                data: sig
            }
        }
        fs.writeFileSync(path.join(os.homedir(), ".userSettings.json"), JSON.stringify(json))
        return {
            status: "success",
            validTime: validTime === -1 ? -1 : currentTimeInfo(validTime)
        }
    }
    catch(e) {
        return {
            status: "error"
        }
    }
}

function checkAndPersistTotalSignature(info: string, totalSignature: string, infoVersion: number) {
    if (totalSignature.length < 11) {
        return {
            status: "illegal"
        }
    }
    let validTime = Number(totalSignature.substr(0, 10))
    if (validTime === 0) {
        validTime = -1
    }
    else if (validTime <= currnetTimestamp()) {
        return {
            status: "illegal"
        }
    }
    let sig = totalSignature.substr(10)
    return checkAndPersistSignature(info, sig, infoVersion, validTime)
}

export{ checkLocalStatus, checkAndPersistTotalSignature }