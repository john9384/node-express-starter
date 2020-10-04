exports.sendResponse = ({ message, content, success = true }) => {
  return {
    success: success,
    content: content || {},
    message: message || ""
  };
};
