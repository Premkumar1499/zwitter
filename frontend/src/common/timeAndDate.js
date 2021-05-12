
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novermber', 'December']

export const getTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let AMPM = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes
    return `${hours}:${minutes} ${AMPM}`;
}

export const getDate = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    return `${months[month].slice(0, 3)} ${day}, ${year}`
}

export const getMonthAndDay = (date) => {
    const month = date.getMonth()
    const day = date.getDate()

    return `${months[month].slice(0, 3)} ${day}`
}

export const getTimeAndDate = (date) => {
    return `${getTime(date)} · ${getDate(date)}`
}

export const getPostTime = (currentTime, postedTime) => {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;

    var elapsed = currentTime - postedTime;

    if (elapsed < msPerMinute) {
        if (elapsed / 1000 < 30) return "Just now";
        return Math.round(elapsed / 1000) + 's';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + 'm';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + 'h';
    }

    else {
        return getMonthAndDay(postedTime)
    }
}
