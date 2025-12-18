import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { config } from "./config.js"
import { v4 as uuidv4 } from 'uuid';

/**
 * Storage Manager for saving workflow data and generated code
 * Base path: ../projects/{projectId}/
 */
export class StorageManager {
  constructor() {
    this.basePath = config.paths.baseDir;
    this.metaFile = path.join(this.basePath, 'meta.json');
  }

  setProjectId(projectId){
    this.projectId = projectId
  }

  getProjectId(projectId) {
    return this.projectId;
  }
  /**
   * Get project directory path
   */
  getProjectPath(projectId) {
    return path.join(this.basePath, projectId);
  }

  /**
   * Get data directory path
   */
  getDataPath(projectId) {
    return path.join(this.getProjectPath(projectId), 'data');
  }

  /**
   * Get code directory path
   */
  getCodePath(projectId) {
    return path.join(this.getProjectPath(projectId), 'code');
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
  async saveWorkflowData(projectId, workflowData) {
    try {
      const dataPath = this.getDataPath(projectId);
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
  async saveCodeFile(projectId, relativePath, content) {
    try {
      const codePath = this.getCodePath(projectId);
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
  async loadWorkflowData(projectId) {
    try {
      const filePath = path.join(this.getDataPath(projectId), 'workflow.json');
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
  async projectExists(projectId) {
    try {
      const projectPath = this.getProjectPath(projectId);
      await fs.access(projectPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Save project metadata
   */
  async saveProjectMeta(projectId, projectName, prompt) {
    try {
      // Ensure base directory exists
      await this.ensureDirectory(this.basePath);

      let meta = {};
      
      // Read existing meta file if it exists
      try {
        const metaContent = await fs.readFile(this.metaFile, 'utf-8');
        meta = JSON.parse(metaContent);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
        // If file doesn't exist, start with empty object
        meta = {};
      }

      // Update or add project metadata
      meta[projectId] = {
        id: projectId,
        name: projectName,
        prompt: prompt,
        createdAt: new Date().toISOString()
      };

      // Write updated meta file
      await fs.writeFile(this.metaFile, JSON.stringify(meta, null, 2), 'utf-8');
      console.log(`[StorageManager] Project metadata saved for: ${projectId}`);
    } catch (error) {
      console.error(`[StorageManager] Failed to save project metadata:`, error);
      throw error;
    }
  }

  /**
   * Get project metadata
   */
  async getProjectMeta() {
    try {
      const metaContent = await fs.readFile(this.metaFile, 'utf-8');
      return JSON.parse(metaContent);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return {}; // Return empty object if meta file doesn't exist
      }
      throw error;
    }
  }

  /**
   * List all projects
   */
  async listProjects() {
    try {
      // Ensure base directory exists
      await this.ensureDirectory(this.basePath);

      const entries = await fs.readdir(this.basePath, { withFileTypes: true });
      console.log('entries---',entries)
      // Filter out only directories that are valid UUIDs
      const projects = entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .filter(name => {
          try {
            // Check if it's a valid UUID
            uuidv4.parse(name);
            return true;
          } catch {
            return false;
          }
        });

      return projects;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }



  // 清空目录的函数
  async clearDirectory(dirPath) {
    try {
        // 检查目录是否存在
        try {
            await fs.access(dirPath);
        } catch {
            // 如果目录不存在，则创建空目录
            await fs.mkdir(dirPath, { recursive: true });
            return;
        }

        // 读取目录下所有文件和子目录
        const files = await fs.readdir(dirPath);

        // 删除每个文件和子目录
        await Promise.all(files.map(async (file) => {
            const filePath = path.join(dirPath, file);
            const stat = await fs.lstat(filePath);
            
            if (stat.isDirectory()) {
                // 如果是目录，递归删除
                await fs.rm(filePath, { recursive: true, force: true });
            } else {
                // 如果是文件，直接删除
                await fs.unlink(filePath);
            }
        }));

        console.log(`[Server] 已清空目录: ${dirPath}`);
    } catch (error) {
        console.error(`[Server] 清空目录错误 (${dirPath}):`, error);
        throw error;
    }
  }
}

export default new StorageManager();
