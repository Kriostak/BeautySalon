import { themeStylesType, themeType } from "./types";

const dark: themeStylesType = {
    border: 'lightgray',
    backgroundTitle: 'rgba(21, 23, 24, 1)',
    backgroundSection: 'rgba(21, 23, 24, .75)',
    backgroundList: 'rgba(21, 23, 24, .65)',
    backgroundModal: 'rgb(50, 51, 51)',
    backgroundSegmentControl: 'rgb(30, 32, 32)',
    tintSegmentControl: 'rgb(63, 63, 63)',
    color: '#fff'
}

const light: themeStylesType = {
    border: '#000',
    backgroundTitle: 'lightgray',
    backgroundSection: '#fff',
    backgroundList: '#fff',
    backgroundModal: '#fff',
    backgroundSegmentControl: 'rgb(243, 243, 243)',
    tintSegmentControl: '#fff',
    color: '#000'
}

const themeStyles: Record<themeType, themeStylesType> = {
    dark,
    light
}

export default themeStyles;