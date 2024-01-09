/**
 * @description DTO de respuesta del Funko
 */
export class FunkoNotificationResponse {
  /**
   * @description Constructor de la clase
   * @param id identificador
   * @param name nombre
   * @param price precio
   * @param stock stock
   * @param image imagen
   * @param category categoría
   * @param createdAt fecha de creación
   * @param updatedAt fecha de actualización
   * @param isActive indica si está activo
   */
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public stock: number,
    public image: string,
    public category: string,
    public createdAt: string,
    public updatedAt: string,
    public isActive: boolean,
  ) {}
}
