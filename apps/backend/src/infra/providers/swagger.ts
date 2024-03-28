import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
  .setTitle('Assistify API')
  .setDescription(
    'This API was developed to serve as the backend server for the Assistify application, a platform designed to automate interactions on WhatsApp. It provides a wide range of functionalities to facilitate task automation, such as scheduled message sending, personalized automatic replies, contact and group management, among others. The API has been carefully designed to ensure smooth integration with the Assistify platform, allowing for an efficient and scalable experience in automating WhatsApp interactions.'
  )
  .addTag(
    'Authentication',
    "This token-based authentication functionality allows you to protect access to a specific group of API routes. Users must provide a valid access token to authenticate their identities and gain permission to access the protected routes. Additionally, a refresh token is used to obtain a new access token after the expiration of the previous one, keeping the user's session active continuously. "
  )
  .addTag(
    'Notifications',
    'This group of routes is responsible for providing functionalities related to notifications within the API. It allows for real-time notification delivery to users, communicating important events or relevant updates. '
  )
  .addTag(
    'Storage',
    'This group of routes provides functionalities for managing file storage within the API. It allows users to perform operations such as upload, download, update, and delete stored files. '
  )
  .addTag(
    'Users',
    'This group of routes encompasses functionalities related to user management within the API. It provides methods for creating, retrieving, updating, and deleting user information.'
  )
  .addTag(
    'Workspaces',
    'This group of routes focuses on functionalities related to workspace management within the API. A workspace is a virtual working environment where users can collaborate, share information, and perform tasks.'
  )
  .addBearerAuth()
  .build();
