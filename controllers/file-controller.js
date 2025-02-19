const fileListDto = require('../dtos/file-list.dto');
const fileService = require('../services/file-service');

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user.userId;

    const newFile = await fileService.uploadFile(file, userId);

    return responseHelper.sendResponse(res, 200, 'File uploaded successfully', {
      name: updatedFile.name,
      extension: updatedFile.extension,
      mimeType: updatedFile.mimeType,
      size: updatedFile.size,
    });
  } catch (error) {
    console.error(error);
    return responseHelper.sendResponse(res, 500, 'Error uploaded file', { error: error.message });
  }
};

exports.getFileList = async (req, res) => {
  try {
    const { page, list_size: listSize } = await fileListDto.validateAsync(req.query);
    const { files, pagination } = await fileService.getFilesWithPagination(page, listSize);

    return responseHelper.sendResponse(res, 200, 'File list fetched successfully', {
      files,
      pagination,
    });
  } catch (error) {
    console.error('Error fetching file list:', error);
    return responseHelper.sendResponse(res, 500, 'Error fetching file list', { error: error.message });
  }
};

exports.getFileById = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await fileService.getFileById(fileId);

    if (!file) {
      return responseHelper.sendResponse(res, 404, 'File not found');
    }
    return responseHelper.sendResponse(res, 200, 'File fetched successfully', file);
  } catch (error) {
    console.error('Error fetching file by id:', error);
    return responseHelper.sendResponse(res, 500, 'Error fetching file by id', { error: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  const { id } = req.params;
  try {
    await fileService.deleteFile(id);
    return responseHelper.sendResponse(res, 200, 'File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    return responseHelper.sendResponse(res, 500, 'Error deleting file', { error: error.message });
  }
};

exports.downloadFile = async (req, res) => {
  const { id } = req.params;
  try {
    const fileStream = await fileService.downloadFile(id);

    if (!fileStream) {
      return responseHelper.sendResponse(res, 404, 'File not found');
    }

    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
    return responseHelper.sendResponse(res, 500, 'Error downloading file', { error: error.message });
  }
};

exports.updateFile = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const file = req.file;

    if (!file) {
      return responseHelper.sendResponse(res, 400, 'No file uploaded');
    }

    const updatedFile = await fileService.updateFile(file, id, userId);

    if (!updatedFile) {
      return responseHelper.sendResponse(res, 404, 'File not found or could not be updated');
    }

    return responseHelper.sendResponse(res, 200, 'File updated successfully', {
      name: updatedFile.name,
      extension: updatedFile.extension,
      mimeType: updatedFile.mimeType,
      size: updatedFile.size,
    });

  } catch (error) {
    console.error('Error in updateFile controller:', error);
    return responseHelper.sendResponse(res, 500, 'Error updating file', { error: error.message });
  }
};