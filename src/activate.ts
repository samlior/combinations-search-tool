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
let infoVersion = 1
let privKey = "506a80889dd76682626b572d65b063cb659210d1608630fee683079a808cd25c"
let pubKey = "02f1c1b7aae0a31459364380849f550977b97d4c0247a62f9fe16b24aeea90136b"

function makeInfoTitle(version ?: number, platform ?: string): string {
    return `${version ? version : infoVersion}${sep}${platform ? platform : os.platform()}`
}

async function fetchDiskInfo(): Promise<string> {
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

            let dInfo = ""
            for (let i = 0; i < devices.length; i++) {
                if (devices[i].filesystem !== "Local Fixed Disk") {
                    continue
                }
                dInfo += `${devices[i].mounted}${sep}${devices[i].blocks}${sep}`
            }
            resolve(dInfo.substr(0, dInfo.length - sep.length))
      });
    })
}

function fetchOSInfo(): string {
    let cpus = os.cpus()
    return `${cpus.length > 0 ? cpus[0].model.replace(/\s*/g, '') : "unknow"}${sep}${os.arch()}${sep}${os.homedir()}${sep}${os.hostname()}`
}

async function fetchWMICInformation(type: string, keys?: Set<string>): Promise<Array<Map<string, string>>> {
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
                                    lastResult.set(pair[0], pair[1].replace(/\s*/g, ''))
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
    let title = makeInfoTitle(version, platform)
    let diskInfo = await fetchDiskInfo()
    let OSInfo = fetchOSInfo()
    let csproductInfo = appendInfo(await fetchWMICInformation("csproduct", new Set<string>(["Name", "UUID", "Vendor"])))
    let biosInfo = appendInfo(await fetchWMICInformation("bios", new Set<string>(["BiosCharacteristics", "ReleaseDate",
        "SMBIOSBIOSVersion", "SMBIOSMajorVersion", "SMBIOSMinorVersion", "Version"])))
    let nicInfo = appendInfo(await fetchWMICInformation("nic", new Set<string>(["AdapterType", "MACAddress", "Name"])))

    return baseUtil.encode(Buffer.from(`${title}${largeSep}${diskInfo}${largeSep}${OSInfo}${largeSep}${csproductInfo}${largeSep}${biosInfo}${largeSep}${nicInfo}`)).toString()
}

function parseInfo(info: string): any {
    try {
        info = baseUtil.decode(info).toString()
        let result: any = {
            title: {},
            diskInfo: {},
            OSInfo: {},
            csproductInfo: {},
            biosInfo: {},
            nicInfo: []
        }
        let infos = info.split(largeSep)
        let title = infos[0].split(sep)
        if (Number(title[0]) !== infoVersion) {
            // 暂时只处理一个版本
            return null
        }

        result["title"]["version"] = title[0]
        result["title"]["platform"] = title[1]

        let diskInfo = infos[1].split(sep)
        for (let i = 0; i < diskInfo.length; i += 2) {
            result["diskInfo"][diskInfo[i]] = diskInfo[i + 1]
        }

        let OSInfo = infos[2].split(sep)
        result["OSInfo"]["cpu"] = OSInfo[0]
        result["OSInfo"]["arch"] = OSInfo[1]
        result["OSInfo"]["homedir"] = OSInfo[2]
        result["OSInfo"]["hostname"] = OSInfo[3]

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

        let nicInfo = infos[5].split(sep)
        for (let i = 0; i < nicInfo.length; i += 3) {
            let nic = {
                AdapterType: nicInfo[i],
                MACAddress: nicInfo[i + 1],
                Name: nicInfo[i + 2]
            }
            result["nicInfo"].push(nic)
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
            return {
                status: "update",
                info: (versionEqual ? info : await collectInfo()),
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