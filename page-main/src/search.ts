function deep_copy_arr(arr: number[]) {
    let new_arr: number[] = []
    for (let e of arr) {
        new_arr.push(e)
    }
    return new_arr
}

function not_in(arr: number[], n: number) {
    for (let e of arr) {
        if (e === n) {
            return false
        }
    }
    return true
}

let total_result: number[][] = []

export function is_init() {
    return total_result.length !== 0
}

export function clear() {
    total_result = []
}

export let selected_count: number = 6
export let total_count: number = 33

export function init(arr: number[] = []) {
    if (arr.length === selected_count) {
        total_result.push(arr)
        return
    }
    for (let i = arr.length === 0 ? 1 : arr[arr.length - 1] + 1; i <= total_count; i++) {
        let new_arr = deep_copy_arr(arr)
        new_arr.push(i)
        init(new_arr)
    }
}

export function reset(s: number, t: number) {
    clear()
    selected_count = s
    total_count = t
}

export class search_rule {
    nums: number[] = []
    show_count: number[] = []
}

const total_prime: number[] = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
const total_composite: number[] = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35, 36, 38, 39, 40, 42, 44, 45, 46, 48, 49, 50, 51, 52, 54, 55, 56, 57, 58, 60, 62, 63, 64, 65, 66, 68, 69, 70, 72, 74, 75, 76, 77, 78, 80, 81, 82, 84, 85, 86, 87, 88, 90, 91, 92, 93, 94, 95, 96, 98, 99, 100]

function find_first_linking(arr: number[], num: number) {
    while (!not_in(arr, num)) {
        num--
    }
    num++
    return !not_in(arr, num) ? num : null
}

export function search(odd: number, even: number, prime: number, composite: number, linking: number, rules: search_rule[]): number[][] {
    if (odd + even + prime + composite + linking === -5 && rules.length === 0) {
        return null
    }

    if (!is_init()) {
        return null
    }

    let legal_result: number[][] = []
    for (let result of total_result) {
        let _odd = 0, _even = 0, _prime = 0, _composite = 0, _linking = 0
        let tmp_arr: number[] = []
        let tmp_first_linking_arr: number[] = []
        let rule_count: number[] = []
        for (let l = 0; l < rules.length; l++) {
            rule_count.push(0)
        }
        for (let num of result) {
            if (num % 2 === 1) {
                _odd++
            }
            if (num % 2 === 0) {
                _even++
            }
            if (!not_in(total_prime, num)) {
                _prime++
            }
            if (!not_in(total_composite, num)) {
                _composite++
            }
            for (let tmp_num of tmp_arr) {
                if (tmp_num === num - 1) {
                    _linking++
                    let first_linking = find_first_linking(tmp_arr, num - 1)
                    if (first_linking && not_in(tmp_first_linking_arr, first_linking)) {
                        _linking++
                        tmp_first_linking_arr.push(first_linking)
                    }
                }
            }
            tmp_arr.push(num)

            for (let l = 0; l < rules.length; l++) {
                let rule = rules[l]
                if (!not_in(rule.nums, num)) {
                    rule_count[l]++
                }
            }
        }
        let rule_flag = true
        for (let l = 0; l < rules.length; l++) {
            if (not_in(rules[l].show_count, rule_count[l])) {
                rule_flag = false
                break
            }
        }
        let b = rule_flag &&
            (_odd === odd || odd === -1) &&
            (_even === even || even === -1) &&
            (_prime === prime || prime === -1) &&
            (_composite === composite || composite === -1) &&
            (_linking === linking || linking === -1)
        if (b) {
            legal_result.push(result)
        }
    }

    return legal_result
}