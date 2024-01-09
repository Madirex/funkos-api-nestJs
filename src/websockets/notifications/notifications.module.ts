import { Module } from '@nestjs/common'
import { CategoriesNotificationsGateway } from './categories-notifications.gateway'
import { FunkosNotificationsGateway } from './funkos-notifications.gateway'

/**
 * Módulo de notificaciones
 */
@Module({
  providers: [CategoriesNotificationsGateway, FunkosNotificationsGateway],
  exports: [CategoriesNotificationsGateway, FunkosNotificationsGateway],
})
export class NotificationsModule {}
