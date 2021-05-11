function getNDCCoordinates(event) {
    const {
        clientHeight,
        clientWidth,
        offsetLeft,
        offsetTop,
    } = canvas;

    const xRelativePx = event.clientX - offsetLeft;
    const x = (xRelativePx / clientWidth) * 2 - 1;

    const yRelativePx = event.clientY - offsetTop;
    const y = -(yRelativePx / clientHeight) * 2 + 1;

    return [x, y];
}

export default getNDCCoordinates;