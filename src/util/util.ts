/**
 * Clase Util
 */
export class Util {
  /**
   * Obtiene la fecha y hora actual en formato string
   */
  static getCurrentDateTimeString(): string {
    const date = new Date()
    const year = this.addLeadingZero(date.getFullYear().toString())
    const month = this.addLeadingZero((date.getMonth() + 1).toString())
    const day = this.addLeadingZero(date.getDate().toString())
    const hour = this.addLeadingZero(date.getHours().toString())
    const minute = this.addLeadingZero(date.getMinutes().toString())
    const second = this.addLeadingZero(date.getSeconds().toString())
    const millisecond = date.getMilliseconds().toString()
    return `${year}-${month}-${day}-${hour}-${minute}-${second}-${millisecond}`
  }

  /**
   * Añade un cero delante de un valor si es necesario
   * @param value Valor a comprobar
   * @private Método privado
   */
  private static addLeadingZero(value: string): string {
    return value.length === 1 ? `0${value}` : value
  }
}
