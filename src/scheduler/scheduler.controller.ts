import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SchedulerService } from './scheduler.service';

@ApiTags('scheduler')
@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  /**
   * Liste toutes les notifications planifiées
   */
  @Get('notifications')
  @ApiOperation({ summary: 'Lister toutes les tâches planifiées' })
  findAll() {
    return this.schedulerService.findAllNotifications();
  }

  /**
   * État d'une notification précise
   */
  @Get('notifications/:id/status')
  @ApiOperation({ summary: "Vérifier l'état d'une notification" })
  @ApiParam({ name: 'id', example: 1 })
  getStatus(@Param('id', ParseIntPipe) id: number) {
    return this.schedulerService.getNotificationStatus(id);
  }

  /**
   * Déclencher UNE notification manuellement
   */
  @Post('notifications/:id/trigger')
  @ApiOperation({ summary: 'Lancer une notification manuellement' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Email simulé envoyé dans le terminal' })
  @HttpCode(HttpStatus.OK)
  triggerOne(@Param('id', ParseIntPipe) id: number) {
    return this.schedulerService.triggerManually(id);
  }

  /**
   * Infos sur les CRON (prochain déclenchement)
   * ⚠️ Ce GET doit être déclaré AVANT le POST /:name/trigger
   */
  @Get('cron')
  @ApiOperation({ summary: 'Voir les CRON enregistrés et leur prochain déclenchement' })
  getCronJobs() {
    return this.schedulerService.getCronJobs();
  }

  /**
   * Simuler le déclenchement d'un CRON entier manuellement
   */
  @Post('cron/reminder-J-5/trigger')
  @ApiOperation({
    summary: 'Déclencher manuellement le CRON J-5',
    description: 'Traite toutes les notifications J-5 en attente (PENDING)',
  })
  @ApiResponse({ status: 200, description: 'Nombre de notifications traitées' })
  @HttpCode(HttpStatus.OK)
  triggerCronJ5() {
    return this.schedulerService.triggerCronByName('reminder-J-5');
  }

  /**
   * Simuler le déclenchement d'un CRON entier manuellement
   */
  @Post('cron/reminder-J-3/trigger')
  @ApiOperation({
    summary: 'Déclencher manuellement le CRON J-3',
    description: 'Traite toutes les notifications J-3 en attente (PENDING)',
  })
  @ApiResponse({ status: 200, description: 'Nombre de notifications traitées' })
  @HttpCode(HttpStatus.OK)
  triggerCronJ3() {
    return this.schedulerService.triggerCronByName('reminder-J-3');
  }
}