import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { config } from "./config.js"
/**
 * Storage Manager for saving workflow data and generated code
 * Base path: D:/frontend-code/{clientId}/{projectId}/
 */
export class StorageManager {
  constructor() {
    // this.basePath = config.paths.baseDir;
    this.basePath = "D:/frontend-code";
  }

  /**
   * Get project directory path
   */
  getProjectPath(clientId, projectId) {
    return path.join(this.basePath, clientId, projectId);
  }

  /**
   * Get data directory path
   */
  getDataPath(clientId, projectId) {
    return path.join(this.getProjectPath(clientId, projectId), 'data');
  }

  /**
   * Get code directory path
   */
  getCodePath(clientId, projectId) {
    return path.join(this.getProjectPath(clientId, projectId), 'code');
  }

  /**
   * Ensure directory exists
   */
  async ensureDirectory(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
      return true;
    } catch (error) {
      console.error(`[StorageManager] Failed to create directory ${dirPath}:`, error);
      throw error;
    }
  }

  /**
   * Save workflow data to local storage
   */
  async saveWorkflowData(clientId, projectId, workflowData) {
    try {
      const dataPath = this.getDataPath(clientId, projectId);
      await this.ensureDirectory(dataPath);

      const filePath = path.join(dataPath, 'workflow.json');
      await fs.writeFile(filePath, JSON.stringify(workflowData, null, 2), 'utf-8');

      console.log(`[StorageManager] Workflow data saved to: ${filePath}`);
      return { success: true, path: filePath };
    } catch (error) {
      console.error(`[StorageManager] Failed to save workflow data:`, error);
      throw error;
    }
  }

  /**
   * Save generated code file to local storage
   */
  async saveCodeFile(clientId, projectId, relativePath, content) {
    try {
      const codePath = this.getCodePath(clientId, projectId);
      const filePath = path.join(codePath, relativePath);

      // Ensure directory exists
      const dir = path.dirname(filePath);
      await this.ensureDirectory(dir);

      // Write file
      await fs.writeFile(filePath, content, 'utf-8');

      console.log(`[StorageManager] Code file saved to: ${filePath}`);
      return { success: true, path: filePath };
    } catch (error) {
      console.error(`[StorageManager] Failed to save code file ${relativePath}:`, error);
      throw error;
    }
  }

  /**
   * Load workflow data from local storage
   */
  async loadWorkflowData(clientId, projectId) {
    try {
      const filePath = path.join(this.getDataPath(clientId, projectId), 'workflow.json');
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null; // File doesn't exist
      }
      throw error;
    }
  }

  /**
   * Check if project exists
   */
  async projectExists(clientId, projectId) {
    try {
      const projectPath = this.getProjectPath(clientId, projectId);
      await fs.access(projectPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * List all projects for a client
   */
  async listProjects(clientId) {
    try {
      const clientPath = path.join(this.basePath, clientId);
      const entries = await fs.readdir(clientPath, { withFileTypes: true });

      return entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }
}

export default new StorageManager();

