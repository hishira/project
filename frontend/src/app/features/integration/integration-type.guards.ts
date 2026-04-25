import { ApiIntegration, CalendarIntegration, EmailIntegration, Integration, MessengerIntegration } from './integration.model';

export function isEmailIntegration(integration: Integration): integration is EmailIntegration {
  return integration.type === 'email';
}

export function isCalendarIntegration(integration: Integration): integration is CalendarIntegration {
  return integration.type === 'calendar';
}

export function isMessengerIntegration(integration: Integration): integration is MessengerIntegration {
  return integration.type === 'messenger';
}

export function isApiIntegration(integration: Integration): integration is ApiIntegration {
  return integration.type === 'api';
}
