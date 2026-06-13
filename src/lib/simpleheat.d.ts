declare module 'simpleheat' {
  interface SimpleHeat {
    data(points: Array<[number, number, number]>): SimpleHeat;
    max(max: number): SimpleHeat;
    add(point: [number, number, number]): SimpleHeat;
    clear(): SimpleHeat;
    radius(r: number, blur?: number): SimpleHeat;
    gradient(grad: { [key: number]: string }): SimpleHeat;
    resize(): SimpleHeat;
    draw(minOpacity?: number): SimpleHeat;
  }
  function simpleheat(canvas: HTMLCanvasElement | string): SimpleHeat;
  export default simpleheat;
}
