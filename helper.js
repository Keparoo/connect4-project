class Helper {
    //Return true if strColor is a valid css color
    static isColor(strColor) {
        const option = new Option().style;
        option.color = strColor;
        return option.color === strColor;
    }
}