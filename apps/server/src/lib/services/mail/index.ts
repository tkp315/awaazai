import { Application } from 'express';
import { createTransporter, getTransporter, getMailConfig, disconnect } from './client.js';
import * as mailService from './service.js';
import { MailConfig } from '@config/services/mail/index.js';

export async function init(config: MailConfig, appObj?: Application) {
  await createTransporter(config);

  return {
    // Service functions
    ...mailService,
    // Client functions
    getTransporter,
    getMailConfig,
    disconnect,
  };
}

// Export client functions
export { getTransporter, getMailConfig, disconnect };

// Export service functions
export { mailService };

// Export types
export type { MailConfig };

export default { init, getTransporter, getMailConfig, disconnect, mailService };
