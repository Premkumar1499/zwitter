export const themeColor = (color, theme) => {
    let primaryColor, primaryColorBg, rootBgColor, rootTextColor, secondaryColor, lightColor, displayBg, postHover, message


    /*******COLOR*******/
    if (color === '0') { //blue
        primaryColor = "rgba(29, 161, 242, 1)"
        primaryColorBg = "rgba(29, 161, 242, 0.1)"
    } else if (color === "1") { //yellow
        primaryColor = "rgb(255, 173, 31)"
        primaryColorBg = "rgb(255, 173, 31, 0.1)"
    } else if (color === "2") { //pink
        primaryColor = "rgb(224, 36, 94)"
        primaryColorBg = "rgb(224, 36, 94, 0.1)"
    } else if (color === "3") { //violet
        primaryColor = "rgb(121, 75, 196)"
        primaryColorBg = "rgb(121, 75, 196,0.1)"
    } else if (color === "4") { //orange
        primaryColor = "rgb(244, 93, 34)"
        primaryColorBg = "rgb(244, 93, 34, 0.1)"
    } else if (color === "5") { //green
        primaryColor = "rgb(23, 191, 99)"
        primaryColorBg = "rgb(23, 191, 99, 0.1)"
    } else {
        primaryColor = "rgba(29, 161, 242, 1)"
        primaryColorBg = "rgba(29, 161, 242, 0.1)"
    }

    document.documentElement.style.setProperty('--primaryColor', primaryColor);
    document.documentElement.style.setProperty('--primaryColorBg', primaryColorBg);

    /*******THEME**********/
    if (theme === '0') {
        rootBgColor = "rgb(255, 255, 255)"
        rootTextColor = "rgb(15, 20, 25)"
        secondaryColor = "#5b7083"
        lightColor = "rgb(235, 238, 240)"
        displayBg = "rgb(247, 249, 250)"
        postHover = "rgb(235, 238, 240, 0.5)"
        message = "#EFF1F2"
    } else if (theme === '1') {
        rootBgColor = "rgb(21, 32, 43)"
        rootTextColor = "rgb(255, 255, 255)"
        secondaryColor = "#8899a6"
        lightColor = "rgb(56, 68, 77)"
        displayBg = "rgb(25, 39, 52)"
        postHover = "rgb(23, 39, 50)"
        message = "#202E3A"
    } else if (theme === '2') {
        rootBgColor = " rgb(0, 0, 0)"
        rootTextColor = "rgb(217, 217, 217)"
        secondaryColor = "#6e767d"
        lightColor = "rgb(47, 51, 54)"
        displayBg = "rgb(21, 24, 28)"
        postHover = "rgb(21,21,21)"
        message = "#1C1F23"
    }

    document.documentElement.style.setProperty('--rootBgColor', rootBgColor);
    document.documentElement.style.setProperty('--rootTextColor', rootTextColor);
    document.documentElement.style.setProperty('--secondaryColor', secondaryColor);
    document.documentElement.style.setProperty('--lightColor', lightColor);
    document.documentElement.style.setProperty('--displayBg', displayBg);
    document.documentElement.style.setProperty('--postHover', postHover);
    document.documentElement.style.setProperty('--message', message);



}