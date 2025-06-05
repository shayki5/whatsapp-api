const { sessions } = require('../sessions')
const { sendErrorResponse } = require('../utils')

/**
 * @function
 * @async
 * @name getChannelInfo
 * @description Gets information about a channel using the channelId and sessionId
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} req.body.channelId - The ID of the channel to get information for
 * @param {string} req.params.sessionId - The ID of the session to use
 * @returns {Object} - Returns a JSON object with the success status and channel information
 * @throws {Error} - Throws an error if channel is not found or if there is a server error
 */
const getChannelInfo = async (req, res) => {
  try {
    const { channelId } = req.body
    const client = sessions.get(req.params.sessionId)
    const channel = await client.getChatById(channelId)
    if (!channel || !channel.isChannel) { sendErrorResponse(res, 404, 'Channel not Found') }
    res.json({ success: true, channel })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

/**
 * @function
 * @async
 * @name getAllChannels
 * @description Gets all channels for the current session
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} req.params.sessionId - The ID of the session to use
 * @returns {Object} - Returns a JSON object with the success status and array of channels
 * @throws {Error} - Throws an error if there is a server error
 */
const getAllChannels = async (req, res) => {
  try {
    const client = sessions.get(req.params.sessionId)
    const channels = await client.getChannels()
    res.json({ success: true, channels })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

/**
 * @function
 * @async
 * @name createChannel
 * @description Creates a new channel
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} req.params.sessionId - The ID of the session to use
 * @param {string} req.body.title - The title of the channel to create
 * @param {Object} req.body.options - Options for channel creation (description, picture)
 * @returns {Object} - Returns a JSON object with the success status and channel creation result
 * @throws {Error} - Throws an error if there is a server error
 */
const createChannel = async (req, res) => {
  try {
    /*
    #swagger.requestBody = {
      required: true,
      schema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Title of the channel to create',
            example: 'My Channel'
          },
          options: {
            type: 'object',
            description: 'Options for channel creation',
            example: '{ "description": "Channel description" }'
          }
        }
      }
    }
    */
    const { title, options } = req.body
    const client = sessions.get(req.params.sessionId)
    const result = await client.createChannel(title, options)
    res.json({ success: true, result })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

/**
 * @function
 * @async
 * @name deleteChannel
 * @description Deletes a channel
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} req.params.sessionId - The ID of the session to use
 * @param {string} req.body.channelId - The ID of the channel to delete
 * @returns {Object} - Returns a JSON object with the success status and deletion result
 * @throws {Error} - Throws an error if channel is not found or if there is a server error
 */
const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.body
    const client = sessions.get(req.params.sessionId)
    const channel = await client.getChatById(channelId)
    if (!channel || !channel.isChannel) { sendErrorResponse(res, 404, 'Channel not Found') }
    const result = await channel.deleteChannel()
    res.json({ success: true, result })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

/**
 * @function
 * @async
 * @name subscribeToChannel
 * @description Subscribes to a channel
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} req.params.sessionId - The ID of the session to use
 * @param {string} req.body.channelId - The ID of the channel to subscribe to
 * @returns {Object} - Returns a JSON object with the success status and subscription result
 * @throws {Error} - Throws an error if there is a server error
 */
const subscribeToChannel = async (req, res) => {
  try {
    const { channelId } = req.body
    const client = sessions.get(req.params.sessionId)
    const result = await client.subscribeToChannel(channelId)
    res.json({ success: true, result })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

/**
 * @function
 * @async
 * @name unsubscribeFromChannel
 * @description Unsubscribes from a channel
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} req.params.sessionId - The ID of the session to use
 * @param {string} req.body.channelId - The ID of the channel to unsubscribe from
 * @param {Object} req.body.options - Unsubscribe options
 * @returns {Object} - Returns a JSON object with the success status and unsubscription result
 * @throws {Error} - Throws an error if there is a server error
 */
const unsubscribeFromChannel = async (req, res) => {
  try {
    const { channelId, options } = req.body
    const client = sessions.get(req.params.sessionId)
    const result = await client.unsubscribeFromChannel(channelId, options)
    res.json({ success: true, result })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

/**
 * @function
 * @async
 * @name searchChannels
 * @description Searches for channels based on search criteria
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} req.params.sessionId - The ID of the session to use
 * @param {Object} req.body.searchOptions - Search options for finding channels
 * @returns {Object} - Returns a JSON object with the success status and array of found channels
 * @throws {Error} - Throws an error if there is a server error
 */
const searchChannels = async (req, res) => {
  try {
    /*
    #swagger.requestBody = {
      required: true,
      schema: {
        type: 'object',
        properties: {
          searchOptions: {
            type: 'object',
            description: 'Search options for finding channels',
            example: '{ "searchText": "news", "limit": 10 }'
          }
        }
      }
    }
    */
    const { searchOptions } = req.body
    const client = sessions.get(req.params.sessionId)
    const channels = await client.searchChannels(searchOptions)
    res.json({ success: true, channels })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

/**
 * @function
 * @async
 * @name getChannelByInviteCode
 * @description Gets a channel by its invite code
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} req.params.sessionId - The ID of the session to use
 * @param {string} req.body.inviteCode - The invite code of the channel
 * @returns {Object} - Returns a JSON object with the success status and channel information
 * @throws {Error} - Throws an error if there is a server error
 */
const getChannelByInviteCode = async (req, res) => {
  try {
    const { inviteCode } = req.body
    const client = sessions.get(req.params.sessionId)
    const channel = await client.getChannelByInviteCode(inviteCode)
    res.json({ success: true, channel })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

/**
 * @function
 * @async
 * @name sendChannelMessage
 * @description Sends a message to a channel
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} req.params.sessionId - The ID of the session to use
 * @param {string} req.body.channelId - The ID of the channel to send a message to
 * @param {string|Object} req.body.content - The content of the message to send
 * @param {Object} req.body.options - Options for sending the message
 * @returns {Object} - Returns a JSON object with the success status and the sent message
 * @throws {Error} - Throws an error if channel is not found or if there is a server error
 */
const sendChannelMessage = async (req, res) => {
  try {
    /*
    #swagger.requestBody = {
      required: true,
      schema: {
        type: 'object',
        properties: {
          channelId: {
            type: 'string',
            description: 'ID of the channel to send a message to',
            example: '123456789@newsletter'
          },
          content: {
            type: 'string',
            description: 'Content of the message to send',
            example: 'Hello channel subscribers!'
          },
          options: {
            type: 'object',
            description: 'Options for sending the message',
            example: '{}'
          }
        }
      }
    }
    */
    const { channelId, content, options } = req.body
    const client = sessions.get(req.params.sessionId)
    const channel = await client.getChatById(channelId)
    if (!channel || !channel.isChannel) { sendErrorResponse(res, 404, 'Channel not Found') }
    const message = await channel.sendMessage(content, options)
    res.json({ success: true, message })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

/**
 * @function
 * @async
 * @name updateChannelInfo
 * @description Updates channel information (subject, description, or profile picture)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} req.params.sessionId - The ID of the session to use
 * @param {string} req.body.channelId - The ID of the channel to update
 * @param {string} req.body.updateType - The type of update (subject, description, or profilePicture)
 * @param {string|Object} req.body.value - The new value for the update
 * @returns {Object} - Returns a JSON object with the success status and update result
 * @throws {Error} - Throws an error if channel is not found or if there is a server error
 */
const updateChannelInfo = async (req, res) => {
  try {
    const { channelId, updateType, value } = req.body
    const client = sessions.get(req.params.sessionId)
    const channel = await client.getChatById(channelId)
    if (!channel || !channel.isChannel) { sendErrorResponse(res, 404, 'Channel not Found') }
    
    let result
    switch (updateType) {
      case 'subject':
        result = await channel.setSubject(value)
        break
      case 'description':
        result = await channel.setDescription(value)
        break
      case 'profilePicture':
        result = await channel.setProfilePicture(value)
        break
      case 'reactionSetting':
        result = await channel.setReactionSetting(value)
        break
      default:
        sendErrorResponse(res, 400, 'Invalid update type')
        return
    }
    
    res.json({ success: true, result })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

/**
 * @function
 * @async
 * @name manageChannelAdmins
 * @description Manages channel admins (invite, accept, revoke, demote)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} req.params.sessionId - The ID of the session to use
 * @param {string} req.body.channelId - The ID of the channel
 * @param {string} req.body.action - The admin action to perform (invite, accept, revoke, demote)
 * @param {string} req.body.userId - The ID of the user (for invite, revoke, demote)
 * @param {Object} req.body.options - Options for the action
 * @returns {Object} - Returns a JSON object with the success status and action result
 * @throws {Error} - Throws an error if channel is not found or if there is a server error
 */
const manageChannelAdmins = async (req, res) => {
  try {
    const { channelId, action, userId, options } = req.body
    const client = sessions.get(req.params.sessionId)
    const channel = await client.getChatById(channelId)
    if (!channel || !channel.isChannel) { sendErrorResponse(res, 404, 'Channel not Found') }
    
    let result
    switch (action) {
      case 'invite':
        result = await channel.sendChannelAdminInvite(userId, options)
        break
      case 'accept':
        result = await channel.acceptChannelAdminInvite()
        break
      case 'revoke':
        result = await channel.revokeChannelAdminInvite(userId)
        break
      case 'demote':
        result = await channel.demoteChannelAdmin(userId)
        break
      default:
        sendErrorResponse(res, 400, 'Invalid admin action')
        return
    }
    
    res.json({ success: true, result })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

/**
 * @function
 * @async
 * @name transferChannelOwnership
 * @description Transfers channel ownership to another user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} req.params.sessionId - The ID of the session to use
 * @param {string} req.body.channelId - The ID of the channel
 * @param {string} req.body.newOwnerId - The ID of the new owner
 * @param {Object} req.body.options - Options for the transfer
 * @returns {Object} - Returns a JSON object with the success status and transfer result
 * @throws {Error} - Throws an error if channel is not found or if there is a server error
 */
const transferChannelOwnership = async (req, res) => {
  try {
    const { channelId, newOwnerId, options } = req.body
    const client = sessions.get(req.params.sessionId)
    const channel = await client.getChatById(channelId)
    if (!channel || !channel.isChannel) { sendErrorResponse(res, 404, 'Channel not Found') }
    const result = await channel.transferChannelOwnership(newOwnerId, options)
    res.json({ success: true, result })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

/**
 * @function
 * @async
 * @name getChannelSubscribers
 * @description Gets the subscribers of a channel
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} req.params.sessionId - The ID of the session to use
 * @param {string} req.body.channelId - The ID of the channel
 * @param {number} req.body.limit - The maximum number of subscribers to return
 * @returns {Object} - Returns a JSON object with the success status and array of subscribers
 * @throws {Error} - Throws an error if channel is not found or if there is a server error
 */
const getChannelSubscribers = async (req, res) => {
  try {
    const { channelId, limit } = req.body
    const client = sessions.get(req.params.sessionId)
    const channel = await client.getChatById(channelId)
    if (!channel || !channel.isChannel) { sendErrorResponse(res, 404, 'Channel not Found') }
    const subscribers = await channel.getSubscribers(limit)
    res.json({ success: true, subscribers })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

/**
 * @function
 * @async
 * @name fetchChannelMessages
 * @description Fetches messages from a channel
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} req.params.sessionId - The ID of the session to use
 * @param {string} req.body.channelId - The ID of the channel
 * @param {Object} req.body.searchOptions - Search options for fetching messages
 * @returns {Object} - Returns a JSON object with the success status and array of messages
 * @throws {Error} - Throws an error if channel is not found or if there is a server error
 */
const fetchChannelMessages = async (req, res) => {
  try {
    /*
    #swagger.requestBody = {
      required: true,
      schema: {
        type: 'object',
        properties: {
          channelId: {
            type: 'string',
            description: 'ID of the channel to fetch messages from',
            example: '123456789@newsletter'
          },
          searchOptions: {
            type: 'object',
            description: 'Search options for fetching messages',
            example: '{ "limit": 50 }'
          }
        }
      }
    }
    */
    const { channelId, searchOptions } = req.body
    const client = sessions.get(req.params.sessionId)
    const channel = await client.getChatById(channelId)
    if (!channel || !channel.isChannel) { sendErrorResponse(res, 404, 'Channel not Found') }
    const messages = await channel.fetchMessages(searchOptions)
    res.json({ success: true, messages })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

/**
 * @function
 * @async
 * @name muteChannel
 * @description Mutes or unmutes a channel
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string} req.params.sessionId - The ID of the session to use
 * @param {string} req.body.channelId - The ID of the channel
 * @param {boolean} req.body.mute - Whether to mute (true) or unmute (false) the channel
 * @returns {Object} - Returns a JSON object with the success status and mute/unmute result
 * @throws {Error} - Throws an error if channel is not found or if there is a server error
 */
const muteChannel = async (req, res) => {
  try {
    const { channelId, mute } = req.body
    const client = sessions.get(req.params.sessionId)
    const channel = await client.getChatById(channelId)
    if (!channel || !channel.isChannel) { sendErrorResponse(res, 404, 'Channel not Found') }
    
    let result
    if (mute) {
      result = await channel.mute()
    } else {
      result = await channel.unmute()
    }
    
    res.json({ success: true, result })
  } catch (error) {
    sendErrorResponse(res, 500, error.message)
  }
}

module.exports = {
  getChannelInfo,
  getAllChannels,
  createChannel,
  deleteChannel,
  subscribeToChannel,
  unsubscribeFromChannel,
  searchChannels,
  getChannelByInviteCode,
  sendChannelMessage,
  updateChannelInfo,
  manageChannelAdmins,
  transferChannelOwnership,
  getChannelSubscribers,
  fetchChannelMessages,
  muteChannel
}
