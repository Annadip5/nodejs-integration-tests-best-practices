const MessageQueueClient = require('../../example-application/libraries/message-queue-client');
const {
  QueueConsumer,
} = require('../../example-application/entry-points/message-queue-consumer');

beforeEach(async () => {
  const messageQueueClient = new MessageQueueClient();
  await messageQueueClient.purgeQueue('user.deleted');
  await setTimeout(1000);
  await messageQueueClient.purgeQueue('user.deleted');
});

test('When user deleted message arrives, then all corresponding orders are deleted', async () => {
  // Arrange
  const orderToAdd = { userId: 1, productId: 2, status: 'approved' };
  const addedOrderId = (await axiosAPIClient.post('/order', orderToAdd)).data
    .id;
  const messageQueueClient = new MessageQueueClient();
  await new QueueConsumer(messageQueueClient, 'user.deleted').start();

  // Act
  await messageQueueClient.publish('user.events', 'user.deleted', {
    id: orderToAdd.userId,
  });

  // Assert
  const aQueryForDeletedOrder = await axiosAPIClient.get(
    `/order/byUserId/${orderToAdd.userId}`
  );
  expect(aQueryForDeletedOrder.data).toMatchObject([]);
});

/**
 * @param  {number} frequency
 * @param  {Function} checkCompletion
 */
const poller = async (frequency, checkCompletion) => {};
