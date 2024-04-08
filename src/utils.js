

export function todayInString() {
    return (new Date()).toISOString().split('T')[0];
}

export function isFutureDate(date) {
    return (new Date()).getTime() < (new Date(date)).getTime();
}