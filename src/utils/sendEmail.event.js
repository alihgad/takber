import {EventEmitter} from 'events';
import { emailTemplate } from '../services/content.js';
export const eventEmitter = new EventEmitter();


eventEmitter.on('sendEmail', async (data) => {
  const {email,subject,name,content,link} = data
  
  await sendEmail(
      email,
      subject,
      emailTemplate(content,name,link)
    );

})