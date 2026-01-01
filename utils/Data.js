import Code from '../components/Code.js'
import Config from '../components/Config.js'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import { pluginRoot } from '../model/path.js'

let mapData = null;
let operatorData = null;
let rankScoreData = null;
let audioTagsData = null;  // 音频标签数据
let audioCharactersData = null;  // 音频角色数据
let audioCategoriesData = null;  // 音频分类数据

// 新增JSON数据缓存变量
let weaponsData = null;
let weaponsSolData = null;  // 烽火地带武器数据
let weaponsMpData = null;   // 全面战场武器数据
let armorsData = null;
let bulletsData = null;
let equipmentData = null;
let battlefieldWeaponsData = null;
let meleeWeaponsData = null;

// API Key 提示标志（确保只提示一次）
let apiKeyWarningShown = false;

/**
 * 显示 API Key 未配置的提示（只提示一次）
 */
function showApiKeyWarning() {
    if (!apiKeyWarningShown) {
        apiKeyWarningShown = true;
        logger.warn('[Delta-Force 数据管理器] 检测到 API Key 未配置，数据文件将无法自动生成');
        logger.warn('[Delta-Force 数据管理器] 请在 config/config.yaml 中填写 api_key 以获取数据');
    }
}

// 本地数据文件路径
const localMapsFile = path.join(pluginRoot, 'config', 'maps.yaml');
const localOperatorsFile = path.join(pluginRoot, 'config', 'operators.yaml');
const localRankScoreFile = path.join(pluginRoot, 'config', 'rankscore.yaml');
const localAudioDataFile = path.join(pluginRoot, 'config', 'audio_data.yaml');  // 统一的音频数据文件

// JSON数据文件路径
const jsonDataFiles = {
    weaponsSol: path.join(pluginRoot, 'resources', 'data', 'weapons_sol.json'), // 烽火地带（sol）武器数据
    weaponsMp: path.join(pluginRoot, 'resources', 'data', 'weapons_mp.json'), // 全面战场（mp）武器数据
    armors: path.join(pluginRoot, 'resources', 'data', 'armors.json'),
    bullets: path.join(pluginRoot, 'resources', 'data', 'bullets.json'),
    equipment: path.join(pluginRoot, 'resources', 'data', 'equipment.json'),
    battlefieldWeapons: path.join(pluginRoot, 'resources', 'data', 'battlefield_weapons.json'),
    meleeWeapons: path.join(pluginRoot, 'resources', 'data', 'melee_weapons.json')
};

/**
 * 加载本地YAML数据
 * @param {string} filePath - YAML文件路径
 * @returns {Map|null} - 加载的数据Map或null
 */
function loadLocalData(filePath, silent = false) {
    try {
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = YAML.parse(fileContent);
            
            if (data && typeof data === 'object') {
                if (!silent) {
                    logger.debug(`[Delta-Force 数据管理器] 成功加载本地数据: ${filePath}`);
                }
                return new Map(Object.entries(data));
            }
        } else {
            if (!silent) {
                logger.warn(`[Delta-Force 数据管理器] 本地数据文件不存在: ${filePath}`);
            }
        }
    } catch (error) {
        logger.error(`[Delta-Force 数据管理器] 加载本地数据失败 (${filePath}):`, error);
    }
    return null;
}

/**
 * 加载JSON数据文件
 * @param {string} filePath - JSON文件路径
 * @returns {Object|null} - 加载的数据对象或null
 */
function loadJsonData(filePath, silent = false) {
    try {
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(fileContent);
            
            if (data && typeof data === 'object') {
                if (!silent) {
                    logger.debug(`[Delta-Force 数据管理器] 成功加载JSON数据: ${filePath}`);
                }
                return data;
            }
        } else {
            if (!silent) {
                logger.warn(`[Delta-Force 数据管理器] JSON数据文件不存在: ${filePath}`);
            }
        }
    } catch (error) {
        logger.error(`[Delta-Force 数据管理器] 加载JSON数据失败 (${filePath}):`, error);
    }
    return null;
}

/**
 * 保存数据到本地YAML文件
 * @param {Map} dataMap - 要保存的Map数据
 * @param {string} filePath - 保存的文件路径
 */
function saveLocalData(dataMap, filePath) {
    try {
        if (!dataMap) return;
        
        // 将Map转换为普通对象
        const dataObj = Object.fromEntries(dataMap);
        
        // 确保目录存在
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // 写入YAML文件
        fs.writeFileSync(filePath, YAML.stringify(dataObj), 'utf8');
        logger.debug(`[Delta-Force 数据管理器] 数据已保存到 ${filePath}`);
    } catch (error) {
        logger.error(`[Delta-Force 数据管理器] 保存本地数据失败 (${filePath}):`, error);
    }
}

/**
 * 加载排位分数数据
 * @param {string} filePath - YAML文件路径
 * @returns {Object|null} - 加载的数据对象或null
 */
function loadRankScoreData(filePath, silent = false) {
    try {
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const data = YAML.parse(fileContent);
            
            if (data && typeof data === 'object') {
                if (!silent) {
                    logger.debug(`[Delta-Force 数据管理器] 成功加载排位分数数据: ${filePath}`);
                }
                return data;
            }
        } else {
            if (!silent) {
                logger.warn(`[Delta-Force 数据管理器] 排位分数数据文件不存在: ${filePath}`);
            }
        }
    } catch (error) {
        logger.error(`[Delta-Force 数据管理器] 加载排位分数数据失败 (${filePath}):`, error);
    }
    return null;
}

/**
 * 保存排位分数数据到本地YAML文件
 * @param {Object} dataObj - 要保存的数据对象
 * @param {string} filePath - 保存的文件路径
 */
function saveRankScoreData(dataObj, filePath) {
    try {
        if (!dataObj) return;
        
        // 确保目录存在
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // 写入YAML文件
        fs.writeFileSync(filePath, YAML.stringify(dataObj), 'utf8');
        logger.debug(`[Delta-Force 数据管理器] 排位分数数据已保存到 ${filePath}`);
    } catch (error) {
        logger.error(`[Delta-Force 数据管理器] 保存排位分数数据失败 (${filePath}):`, error);
    }
}

async function fetchAndCache(dataType) {
    const api = new Code();
    try {
        if (dataType === 'maps') {
            try {
                const res = await api.getMaps();
                if (res && (res.success || res.code === 0)) {
                    mapData = new Map(res.data.map(item => [String(item.id), item.name]));
                    // 缓存成功后保存到本地
                    saveLocalData(mapData, localMapsFile);
                    logger.debug('[Delta-Force 数据管理器] 地图数据同步成功');
                } else {
                    throw new Error('API返回失败状态');
                }
            } catch (apiError) {
                logger.warn('[Delta-Force 数据管理器] 获取地图数据失败，使用本地缓存:', apiError.message);
                // API失败时从本地加载
                if (!mapData) {
                    const localData = loadLocalData(localMapsFile);
                    if (localData && localData.size > 0) {
                        mapData = localData;
                        logger.debug('[Delta-Force 数据管理器] 已从本地加载地图数据（降级）');
                    } else {
                        // 检查 API Key 是否配置
                        const apiKey = Config.get('delta_force', 'api_key');
                        if (!apiKey || apiKey === 'sk-xxxxxxx') {
                            showApiKeyWarning();
                        } else {
                            logger.warn('[Delta-Force 数据管理器] 本地数据文件不存在，将在 API 成功时自动生成');
                        }
                    }
                }
            }
        } else if (dataType === 'operators') {
            try {
                const res = await api.getOperators();
                if (res && (res.success || res.code === 0)) {
                    operatorData = new Map(res.data.map(item => [String(item.id), item.name]));
                    // 缓存成功后保存到本地
                    saveLocalData(operatorData, localOperatorsFile);
                    logger.debug('[Delta-Force 数据管理器] 干员数据同步成功');
                } else {
                    throw new Error('API返回失败状态');
                }
            } catch (apiError) {
                logger.warn('[Delta-Force 数据管理器] 获取干员数据失败，使用本地缓存:', apiError.message);
                // API失败时从本地加载
                if (!operatorData) {
                    const localData = loadLocalData(localOperatorsFile);
                    if (localData && localData.size > 0) {
                        operatorData = localData;
                        logger.debug('[Delta-Force 数据管理器] 已从本地加载干员数据（降级）');
                    } else {
                        // 检查 API Key 是否配置
                        const apiKey = Config.get('delta_force', 'api_key');
                        if (!apiKey || apiKey === 'sk-xxxxxxx') {
                            showApiKeyWarning();
                        } else {
                            logger.warn('[Delta-Force 数据管理器] 本地数据文件不存在，将在 API 成功时自动生成');
                        }
                    }
                }
            }
        } else if (dataType === 'rankscore') {
            try {
                const res = await api.getRankScore();
                if (res && (res.success || res.code === 0)) {
                    // 处理排位分数数据结构
                    const processedData = {};
                    for (const mode in res.data) {
                        processedData[mode] = {};
                        if (Array.isArray(res.data[mode])) {
                            res.data[mode].forEach(item => {
                                processedData[mode][String(item.score)] = item.name;
                            });
                        }
                    }
                    rankScoreData = processedData;
                    // 缓存成功后保存到本地
                    saveRankScoreData(rankScoreData, localRankScoreFile);
                    logger.debug('[Delta-Force 数据管理器] 排位分数数据同步成功');
                } else {
                    throw new Error('API返回失败状态');
                }
            } catch (apiError) {
                logger.warn('[Delta-Force 数据管理器] 获取排位分数数据失败，使用本地缓存:', apiError.message);
                // API失败时从本地加载
                if (!rankScoreData) {
                    const localData = loadRankScoreData(localRankScoreFile);
                    if (localData && Object.keys(localData).length > 0) {
                        rankScoreData = localData;
                        logger.debug('[Delta-Force 数据管理器] 已从本地加载排位分数数据（降级）');
                    } else {
                        // 检查 API Key 是否配置
                        const apiKey = Config.get('delta_force', 'api_key');
                        if (!apiKey || apiKey === 'sk-xxxxxxx') {
                            showApiKeyWarning();
                        } else {
                            logger.warn('[Delta-Force 数据管理器] 本地数据文件不存在，将在 API 成功时自动生成');
                        }
                    }
                }
            }
        } else if (dataType === 'audiodata') {
            // 统一获取音频相关数据：标签、角色、分类
            try {
                const [tagsRes, charactersRes, categoriesRes] = await Promise.all([
                    api.getAudioTags().catch(err => {
                        logger.warn('[Delta-Force 数据管理器] 获取音频标签API失败:', err.message);
                        return null;
                    }),
                    api.getAudioCharacters().catch(err => {
                        logger.warn('[Delta-Force 数据管理器] 获取音频角色API失败:', err.message);
                        return null;
                    }),
                    api.getAudioCategories().catch(err => {
                        logger.warn('[Delta-Force 数据管理器] 获取音频分类API失败:', err.message);
                        return null;
                    })
                ]);

                const audioData = {
                    tags: {},        // tag -> description 映射
                    keywords: {},    // 中文关键词 -> tag 映射
                    characters: {},  // 角色名/ID 双向映射
                    categories: {}   // 中文分类名 -> 英文category 映射
                };

                let hasAnyData = false;

                // 1. 处理音频标签数据
                if (tagsRes && (tagsRes.success || tagsRes.code === 0)) {
                    if (tagsRes.data && Array.isArray(tagsRes.data.tags)) {
                        tagsRes.data.tags.forEach(tagInfo => {
                            const tag = tagInfo.tag || tagInfo;
                            const desc = tagInfo.description || '';
                            
                            // 保存 tag -> description
                            audioData.tags[tag] = desc;
                            
                            // 根据描述自动生成中文关键词映射
                            if (desc) {
                                const keywords = desc.split(/[\/、]/).map(k => k.trim());
                                keywords.forEach(keyword => {
                                    if (keyword && keyword.length > 0 && keyword.length < 20) {
                                        audioData.keywords[keyword] = tag;
                                    }
                                });
                            }
                        });
                        logger.debug(`[Delta-Force 数据管理器] 音频标签: ${Object.keys(audioData.tags).length}个tag, ${Object.keys(audioData.keywords).length}个关键词`);
                        hasAnyData = true;
                    }
                } else {
                    logger.warn('[Delta-Force 数据管理器] 跳过音频标签同步（API失败）');
                }

                // 2. 处理音频角色数据
                if (charactersRes && (charactersRes.success || charactersRes.code === 0)) {
                    if (charactersRes.data && Array.isArray(charactersRes.data.characters)) {
                        charactersRes.data.characters.forEach(char => {
                            const voiceId = char.voiceId;
                            const name = char.name;
                            const operatorId = char.operatorId;
                            
                            // 建立多种格式的映射（前端不需要做，直接传给后端）
                            // 这里只保存基本的中文名映射用于提示
                            if (name) {
                                audioData.characters[name] = voiceId;
                            }
                            
                            // 如果有皮肤，也添加皮肤名映射
                            if (char.skins && Array.isArray(char.skins)) {
                                char.skins.forEach(skin => {
                                    if (skin.name) {
                                        audioData.characters[skin.name] = skin.voiceId;
                                    }
                                });
                            }
                        });
                        logger.debug(`[Delta-Force 数据管理器] 音频角色: ${Object.keys(audioData.characters).length}个映射`);
                        hasAnyData = true;
                    }
                } else {
                    logger.warn('[Delta-Force 数据管理器] 跳过音频角色同步（API失败）');
                }

                // 3. 处理音频分类数据
                if (categoriesRes && (categoriesRes.success || categoriesRes.code === 0)) {
                    if (categoriesRes.data && Array.isArray(categoriesRes.data.categories)) {
                        // 分类中文名映射
                        const categoryNames = {
                            'Voice': '角色语音',
                            'CutScene': '过场动画',
                            'Amb': '环境音效',
                            'Music': '背景音乐',
                            'SFX': '音效',
                            'Festivel': '节日活动',
                            'Intro': '介绍',
                            'UI': '界面',
                            'Voice_SOL_MS': '单人模式'
                        };

                        categoriesRes.data.categories.forEach(catInfo => {
                            const category = catInfo.category || catInfo;
                            const cnName = categoryNames[category] || category;
                            
                            // 英文原文 -> 英文category (支持直接输入 Music、Voice 等)
                            audioData.categories[category] = category;
                            // 中文名 -> 英文category
                            audioData.categories[cnName] = category;
                            // 英文小写 -> 英文category (支持输入 music、voice 等)
                            audioData.categories[category.toLowerCase()] = category;
                        });
                        logger.debug(`[Delta-Force 数据管理器] 音频分类: ${categoriesRes.data.categories.length}个分类`);
                        hasAnyData = true;
                    }
                } else {
                    logger.warn('[Delta-Force 数据管理器] 跳过音频分类同步（API失败）');
                }

                // 只有成功获取到至少一项数据时才保存
                if (hasAnyData) {
                    saveRankScoreData(audioData, localAudioDataFile);
                    // 更新内存中的数据（如果API返回了数据就用新的，否则保留旧的）
                    if (Object.keys(audioData.tags).length > 0 || Object.keys(audioData.keywords).length > 0) {
                        audioTagsData = { _tags: audioData.tags, _keywords: audioData.keywords };
                    }
                    if (Object.keys(audioData.characters).length > 0) {
                        audioCharactersData = audioData.characters;
                    }
                    if (Object.keys(audioData.categories).length > 0) {
                        audioCategoriesData = audioData.categories;
                    }
                    // 汇总日志
                    const tagCount = Object.keys(audioData.tags).length || 0;
                    const keywordCount = Object.keys(audioData.keywords).length || 0;
                    const charCount = Object.keys(audioData.characters).length || 0;
                    const catCount = Object.keys(audioData.categories).length || 0;
                    logger.debug(`[Delta-Force 数据管理器] 音频数据同步完成 (标签${tagCount}/${keywordCount}, 角色${charCount}, 分类${catCount})`);
                }
            } catch (apiError) {
                logger.error('[Delta-Force 数据管理器] 音频数据API请求异常:', apiError.message);
                // API异常时，尝试从本地加载
                const localData = loadRankScoreData(localAudioDataFile);
                if (localData && Object.keys(localData).length > 0) {
                    if (localData.tags && localData.keywords) {
                        audioTagsData = { _tags: localData.tags, _keywords: localData.keywords };
                    }
                    if (localData.characters) {
                        audioCharactersData = localData.characters;
                    }
                    if (localData.categories) {
                        audioCategoriesData = localData.categories;
                    }
                    logger.debug('[Delta-Force 数据管理器] 已从本地加载音频数据（API异常降级）');
                } else {
                    // 检查 API Key 是否配置
                    const apiKey = Config.get('delta_force', 'api_key');
                    if (!apiKey || apiKey === 'sk-xxxxxxx') {
                        showApiKeyWarning();
                    } else {
                        logger.warn('[Delta-Force 数据管理器] 音频数据API异常且无本地缓存，将在 API 成功时自动生成');
                    }
                }
            }
        }
    } catch (error) {
        logger.error(`[Delta-Force 数据管理器] 缓存 ${dataType} 数据失败:`, error);
        // 发生错误时尝试从本地加载
        const apiKey = Config.get('delta_force', 'api_key');
        const isApiKeyConfigured = apiKey && apiKey !== 'sk-xxxxxxx';
        
        if (dataType === 'maps') {
            const localData = loadLocalData(localMapsFile);
            if (localData && localData.size > 0) {
                mapData = localData;
                logger.debug('[Delta-Force 数据管理器] 已从本地加载地图数据');
            } else if (!isApiKeyConfigured) {
                showApiKeyWarning();
            }
        } else if (dataType === 'operators') {
            const localData = loadLocalData(localOperatorsFile);
            if (localData && localData.size > 0) {
                operatorData = localData;
                logger.debug('[Delta-Force 数据管理器] 已从本地加载干员数据');
            } else if (!isApiKeyConfigured) {
                showApiKeyWarning();
            }
        } else if (dataType === 'rankscore') {
            const localData = loadRankScoreData(localRankScoreFile);
            if (localData && Object.keys(localData).length > 0) {
                rankScoreData = localData;
                logger.debug('[Delta-Force 数据管理器] 已从本地加载排位分数数据');
            } else if (!isApiKeyConfigured) {
                showApiKeyWarning();
            }
        } else if (dataType === 'audiodata') {
            const localData = loadRankScoreData(localAudioDataFile);
            if (localData && Object.keys(localData).length > 0) {
                // 从统一文件中加载音频数据
                if (localData.tags && localData.keywords) {
                    audioTagsData = { _tags: localData.tags, _keywords: localData.keywords };
                }
                if (localData.characters) {
                    audioCharactersData = localData.characters;
                }
                if (localData.categories) {
                    audioCategoriesData = localData.categories;
                }
                logger.debug('[Delta-Force 数据管理器] 已从本地加载音频数据');
            } else if (!isApiKeyConfigured) {
                showApiKeyWarning();
            }
        }
    }
}

export default {
    async init() {
        logger.info('[Delta-Force 数据管理器] 正在初始化数据缓存...');
        
        // 先尝试加载本地数据作为初始数据
        const localMaps = loadLocalData(localMapsFile, true);
        if (localMaps && localMaps.size > 0) {
            mapData = localMaps;
        }
        
        const localOperators = loadLocalData(localOperatorsFile, true);
        if (localOperators && localOperators.size > 0) {
            operatorData = localOperators;
        }
        
        const localRankScore = loadRankScoreData(localRankScoreFile, true);
        if (localRankScore && Object.keys(localRankScore).length > 0) {
            rankScoreData = localRankScore;
        }
        
        // 加载音频相关数据（统一文件）
        const localAudioData = loadRankScoreData(localAudioDataFile, true);
        if (localAudioData && Object.keys(localAudioData).length > 0) {
            if (localAudioData.tags && localAudioData.keywords) {
                audioTagsData = { _tags: localAudioData.tags, _keywords: localAudioData.keywords };
            }
            if (localAudioData.characters) {
                audioCharactersData = localAudioData.characters;
            }
            if (localAudioData.categories) {
                audioCategoriesData = localAudioData.categories;
            }
        }
        
        // 加载本地JSON游戏数据（静态数据，无需API同步）
        weaponsData = loadJsonData(jsonDataFiles.weaponsSol, true);  // 保持向后兼容
        weaponsSolData = loadJsonData(jsonDataFiles.weaponsSol, true);  // 烽火地带武器数据
        weaponsMpData = loadJsonData(jsonDataFiles.weaponsMp, true);   // 全面战场武器数据
        armorsData = loadJsonData(jsonDataFiles.armors, true);
        bulletsData = loadJsonData(jsonDataFiles.bullets, true);
        equipmentData = loadJsonData(jsonDataFiles.equipment, true);
        battlefieldWeaponsData = loadJsonData(jsonDataFiles.battlefieldWeapons, true);
        meleeWeaponsData = loadJsonData(jsonDataFiles.meleeWeapons, true);
        
        // 汇总JSON数据加载状态
        const jsonDataLoaded = {
            weapons: !!weaponsData,
            weaponsSol: !!weaponsSolData,
            weaponsMp: !!weaponsMpData,
            armors: !!armorsData,
            bullets: !!bulletsData,
            equipment: !!equipmentData,
            battlefieldWeapons: !!battlefieldWeaponsData,
            meleeWeapons: !!meleeWeaponsData
        };
        
        const successCount = Object.values(jsonDataLoaded).filter(v => v).length;
        const totalCount = Object.keys(jsonDataLoaded).length;
        logger.info(`[Delta-Force 数据管理器] 已加载本地数据 (${successCount}/${totalCount} 个JSON文件)`);
        
        // 然后尝试从API获取最新数据（使用 Promise.allSettled 确保即使API失败也不影响插件加载）
        try {
            const results = await Promise.allSettled([
                fetchAndCache('maps'),
                fetchAndCache('operators'),
                fetchAndCache('rankscore'),
                fetchAndCache('audiodata')  // 统一获取音频数据
            ]);
            
            // 检查每个结果，记录失败的任务
            const taskNames = ['地图', '干员', '排位分数', '音频数据'];
            const failedTasks = [];
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    failedTasks.push(taskNames[index]);
                    logger.warn(`[Delta-Force 数据管理器] ${taskNames[index]}同步失败:`, result.reason);
                }
            });
            
            if (failedTasks.length === 0) {
                logger.info('[Delta-Force 数据管理器] 数据缓存初始化完成');
            } else {
                logger.info(`[Delta-Force 数据管理器] 数据缓存初始化完成（${failedTasks.length}个任务失败，已使用本地缓存）`);
            }
        } catch (error) {
            // 即使Promise.allSettled失败，也不应该影响插件加载
            logger.error('[Delta-Force 数据管理器] 数据同步过程异常:', error);
            logger.warn('[Delta-Force 数据管理器] 将使用本地缓存数据继续运行');
        }
    },

    getMapName(id) {
        // 如果mapData为空，尝试立即从本地加载
        if (!mapData) {
            mapData = loadLocalData(localMapsFile, true);
            if (mapData && mapData.size > 0) {
                logger.debug(`[Delta-Force 数据管理器] 已临时从本地加载地图数据 (${mapData.size}条记录)`);
            } else {
                logger.warn('[Delta-Force 数据管理器] 地图数据未就绪, 返回备用值。');
                return `地图(${id})`;
            }
        }
        return mapData.get(String(id)) || `未知地图(${id})`;
    },

    getOperatorName(id) {
        // 如果operatorData为空，尝试立即从本地加载
        if (!operatorData) {
            operatorData = loadLocalData(localOperatorsFile, true);
            if (operatorData && operatorData.size > 0) {
                logger.debug(`[Delta-Force 数据管理器] 已临时从本地加载干员数据 (${operatorData.size}条记录)`);
            } else {
                logger.warn('[Delta-Force 数据管理器] 干员数据未就绪, 返回备用值。');
                return `干员(${id})`;
            }
        }
        return operatorData.get(String(id)) || `未知干员(${id})`;
    },

    /**
     * 根据分数获取对应的段位名称
     * @param {number|string} score - 分数
     * @param {string} mode - 模式 ('sol' 或 'tdm')
     * @returns {string} - 段位名称
     */
    getRankByScore(score, mode = 'sol') {
        // 如果rankScoreData为空，尝试立即从本地加载
        if (!rankScoreData) {
            rankScoreData = loadRankScoreData(localRankScoreFile, true);
            if (rankScoreData && Object.keys(rankScoreData).length > 0) {
                logger.debug(`[Delta-Force 数据管理器] 已临时从本地加载排位分数数据 (${Object.keys(rankScoreData).length}个模式)`);
            } else {
                logger.warn('[Delta-Force 数据管理器] 排位分数数据未就绪, 返回备用值。');
                return `${score}分`;
            }
        }

        const numScore = parseInt(score);
        if (isNaN(numScore)) {
            return `分数无效(${score})`;
        }

        const modeData = rankScoreData[mode];
        if (!modeData) {
            return `${score}分 (${mode}模式)`;
        }

        // 获取所有分数阈值并排序
        const thresholds = Object.keys(modeData).map(s => parseInt(s)).sort((a, b) => b - a);
        
        // 找到第一个小于等于目标分数的阈值
        for (const threshold of thresholds) {
            if (numScore >= threshold) {
                const rankName = modeData[String(threshold)];
                
                // 检查是否是最高段位（统帅/三角洲巅峰）需要计算星级
                const isHighestRank = (mode === 'sol' && threshold === 6000) || (mode === 'tdm' && threshold === 5000);
                
                if (isHighestRank && numScore > threshold) {
                    // 计算星级：超出部分每50分一颗星
                    const extraScore = numScore - threshold;
                    const stars = Math.floor(extraScore / 50);
                    if (stars > 0) {
                        return `${rankName}${stars}星 (${numScore})`;
                    }
                }
                
                return `${rankName} (${numScore})`;
            }
        }

        // 如果分数低于所有阈值，返回最低段位
        const lowestThreshold = thresholds[thresholds.length - 1];
        const lowestRank = modeData[String(lowestThreshold)];
        return `${lowestRank} (${numScore})`;
    },
    
    /**
     * 根据段位名称和模式获取段位图片路径
     * @param {string} rankName - 段位名称（如"铂金 II"）
     * @param {string} mode - 模式 ('sol' 或 'tdm'/'mp')
     * @returns {string} - 段位图片路径
     */
    getRankImagePath(rankName, mode = 'sol') {
        if (!rankName || rankName.includes('分数无效') || rankName.includes('未知')) {
            return null;
        }

        // 清理段位名称，移除分数和星级信息
        const cleanRankName = rankName.replace(/\s*\(\d+\)/, '').replace(/\d+星/, '').trim();
        
        // 段位映射表
        const rankMappings = {
            'sol': {
                '青铜 V': '1_5', '青铜 IV': '1_4', '青铜 III': '1_3', '青铜 II': '1_2', '青铜 I': '1_1',
                '白银 V': '2_5', '白银 IV': '2_4', '白银 III': '2_3', '白银 II': '2_2', '白银 I': '2_1',
                '黄金 V': '3_5', '黄金 IV': '3_4', '黄金 III': '3_3', '黄金 II': '3_2', '黄金 I': '3_1',
                '铂金 V': '4_5', '铂金 IV': '4_4', '铂金 III': '4_3', '铂金 II': '4_2', '铂金 I': '4_1',
                '钻石 V': '5_5', '钻石 IV': '5_4', '钻石 III': '5_3', '钻石 II': '5_2', '钻石 I': '5_1',
                '黑鹰 V': '6_5', '黑鹰 IV': '6_4', '黑鹰 III': '6_3', '黑鹰 II': '6_2', '黑鹰 I': '6_1',
                '三角洲巅峰': '7'
            },
            'mp': {
                '列兵 V': '1_5', '列兵 IV': '1_4', '列兵 III': '1_3', '列兵 II': '1_2', '列兵 I': '1_1',
                '上等兵 V': '2_5', '上等兵 IV': '2_4', '上等兵 III': '2_3', '上等兵 II': '2_2', '上等兵 I': '2_1',
                '军士长 V': '3_5', '军士长 IV': '3_4', '军士长 III': '3_3', '军士长 II': '3_2', '军士长 I': '3_1',
                '尉官 V': '4_5', '尉官 IV': '4_4', '尉官 III': '4_3', '尉官 II': '4_2', '尉官 I': '4_1',
                '校官 V': '5_5', '校官 IV': '5_4', '校官 III': '5_3', '校官 II': '5_2', '校官 I': '5_1',
                '将军 V': '6_5', '将军 IV': '6_4', '将军 III': '6_3', '将军 II': '6_2', '将军 I': '6_1',
                '统帅': '7'
            }
        };

        // 统一模式名称
        const modeKey = mode === 'tdm' ? 'mp' : mode;
        const mappings = rankMappings[modeKey];
        
        if (!mappings) {
            logger.warn(`[Delta-Force 数据管理器] 未知的游戏模式: ${mode}`);
            return null;
        }

        const rankCode = mappings[cleanRankName];
        if (!rankCode) {
            logger.warn(`[Delta-Force 数据管理器] 未找到段位映射: ${cleanRankName} (模式: ${modeKey})`);
            return null;
        }

        return `imgs/rank/${modeKey}/${rankCode}.webp`;
    },

    /**
     * 随机选择一张背景图片
     * @returns {string} - 背景图片路径
     */
    getRandomBackground() {
        const backgrounds = ['bg2-1.webp', 'bg2-2.webp', 'bg2-3.webp', 'bg2-4.webp', 'bg2-5.webp', 'bg2-6.webp', 'bg2-7.webp'];
        const randomIndex = Math.floor(Math.random() * backgrounds.length);
        return `imgs/background/${backgrounds[randomIndex]}`;
    },

    /**
     * 随机选择人物背景图片（用于烽火地带个人数据模板）
     * @returns {object} - 包含随机选择的人物图片信息
     */
    getRandomCharacterBackgroundConfig() {
        // 人物图片列表 - 只管理图片资源，不涉及样式
        const characterImages = [
            'imgs/background/op/p4_img2.png',
            'imgs/background/op/p4_img3.png', 
            'imgs/background/op/p4_img5.png',
            'imgs/background/op/p4_img6.png',
            'imgs/background/op/p4_img7.png',
            'imgs/background/op/p4_img8.png',
            'imgs/background/op/p4_img9.png'
        ];

        // 随机选择一张图片
        const randomIndex = Math.floor(Math.random() * characterImages.length);
        const selectedImage = characterImages[randomIndex];
        
        // 生成对应的 CSS 类名，样式由 CSS 文件管理
        const imageNumber = selectedImage.match(/p4_img(\d+)/)[1];
        const cssClass = `character-bg-${imageNumber}`;

        logger.debug(`[Delta-Force 数据管理器] 随机选择人物背景: ${selectedImage} (CSS类: ${cssClass})`);

        return {
            image: selectedImage,
            cssClass: cssClass,
            imageNumber: imageNumber
        };
    },

    // ========== JSON游戏数据访问接口 ==========
    
    /**
     * 根据名称获取武器数据 - 兼容繁星攻略组数据格式
     * @param {string} weaponName - 武器名称
     * @param {string} category - 武器类别（可选）
     * @returns {Object|null} - 武器数据对象
     */
    getWeaponByName(weaponName, category = null) {
        if (!weaponsData) {
            weaponsData = loadJsonData(jsonDataFiles.weaponsSol);
        }
        
        if (!weaponsData?.weapons) return null;
        
        let weapon = null;
        if (category) {
            const categoryData = weaponsData.weapons[category];
            if (categoryData && Array.isArray(categoryData)) {
                weapon = categoryData.find(w => w.name === weaponName);
            }
        } else {
            // 在所有类别中搜索
            for (const categoryKey in weaponsData.weapons) {
                const categoryWeapons = weaponsData.weapons[categoryKey];
                if (Array.isArray(categoryWeapons)) {
                    weapon = categoryWeapons.find(w => w.name === weaponName);
                    if (weapon) {
                        // 确保武器数据包含所有必要字段
                        weapon = {
                            ...weapon,
                            category: categoryKey,
                            // 兼容不同的字段名
                            decayDistances: weapon.decayDistances || weapon.decay_distances || [],
                            decayMultipliers: weapon.decayMultipliers || weapon.decay_factors || []
                        };
                        break;
                    }
                }
            }
        }
        
        return weapon;
    },

    /**
     * 根据口径获取武器列表
     * @param {string} caliber - 口径
     * @returns {Array} - 武器列表
     */
    getWeaponsByCaliber(caliber) {
        if (!weaponsData) {
            weaponsData = loadJsonData(jsonDataFiles.weaponsSol);
        }
        
        const results = [];
        for (const categoryKey in weaponsData?.weapons) {
            const categoryWeapons = weaponsData.weapons[categoryKey];
            const matched = categoryWeapons.filter(w => w.caliber === caliber);
            results.push(...matched);
        }
        
        return results;
    },

    /**
     * 获取所有武器类别
     * @returns {Array} - 武器类别列表
     */
    getWeaponCategories() {
        if (!weaponsData) {
            weaponsData = loadJsonData(jsonDataFiles.weaponsSol);
        }
        
        return Object.keys(weaponsData?.weapons || {});
    },

    /**
     * 获取指定类别的所有武器
     * @param {string} category - 武器类别
     * @returns {Array} - 武器列表
     */
    getWeaponsByCategory(category) {
        if (!weaponsData) {
            weaponsData = loadJsonData(jsonDataFiles.weaponsSol);
        }
        
        const weapons = weaponsData?.weapons?.[category] || [];
        return weapons;
    },

    /**
     * 根据防护等级获取护甲列表
     * @param {number} level - 防护等级
     * @param {string} type - 护甲类型（可选）
     * @returns {Array} - 护甲列表
     */
    getArmorsByLevel(level, type = null) {
        if (!armorsData) {
            armorsData = loadJsonData(jsonDataFiles.armors);
        }
        
        let armors = armorsData?.armors?.body_armor || [];
        
        if (type) {
            armors = armors.filter(a => a.type === type);
        }
        
        return armors.filter(a => a.protectionLevel === level);
    },

    /**
     * 根据名称获取护甲数据 - 兼容繁星攻略组数据格式
     * @param {string} armorName - 护甲名称
     * @returns {Object|null} - 护甲数据对象
     */
    getArmorByName(armorName) {
        if (!armorsData) {
            armorsData = loadJsonData(jsonDataFiles.armors);
        }
        
        if (!armorsData?.armors) return null;
        
        // 在所有护甲类别中搜索
        for (const categoryKey in armorsData.armors) {
            const categoryArmors = armorsData.armors[categoryKey];
            if (Array.isArray(categoryArmors)) {
                const armor = categoryArmors.find(a => a.name === armorName || a.name.includes(armorName));
                if (armor) {
                    // 确保护甲数据包含所有必要字段
                    return {
                        ...armor,
                        category: categoryKey,
                        // 兼容不同的字段名
                        protectionLevel: armor.protectionLevel || armor.protection_level,
                        repairLoss: armor.repairLoss || armor.repair_loss,
                        repairPrice: armor.repairPrice || armor.repair_price,
                        repairEfficiencies: armor.repairEfficiencies || armor.repair_efficiencies
                    };
                }
            }
        }
        
        return null;
    },

    /**
     * 根据口径获取子弹列表
     * @param {string} caliber - 口径
     * @returns {Array} - 子弹列表
     */
    getBulletsByCaliber(caliber) {
        if (!bulletsData) {
            bulletsData = loadJsonData(jsonDataFiles.bullets);
        }
        
        const bullets = bulletsData?.bullets?.[caliber] || [];
        return bullets;
    },

    /**
     * 获取装备价格数据
     * @param {string} category - 装备类别（可选）
     * @returns {Object|Array} - 装备数据
     */
    getEquipmentData(category = null) {
        if (!equipmentData) {
            equipmentData = loadJsonData(jsonDataFiles.equipment);
        }
        
        if (category) {
            return equipmentData?.[category] || [];
        }
        return equipmentData || {};
    },

    /**
     * 获取战场模式武器数据
     * @param {string} category - 武器类别（可选）
     * @returns {Object|Array} - 武器数据
     */
    getBattlefieldWeapons(category = null) {
        if (!battlefieldWeaponsData) {
            battlefieldWeaponsData = loadJsonData(jsonDataFiles.battlefieldWeapons);
        }
        
        if (category) {
            return battlefieldWeaponsData?.[category] || [];
        }
        return battlefieldWeaponsData || {};
    },

    /**
     * 根据游戏模式获取武器数据
     * @param {string} mode - 游戏模式 ('sol'烽火地带 或 'mp'全面战场)
     * @param {string} weaponName - 武器名称
     * @param {string} category - 武器类别（可选）
     * @returns {Object|null} - 武器数据对象
     */
    getWeaponByMode(mode, weaponName, category = null) {
        let dataFile = null;
        
        if (mode === 'mp' || mode === 'battlefield') {
            // 全面战场模式
            dataFile = jsonDataFiles.weaponsMp;
        } else {
            // 默认使用烽火地带模式数据 (sol)
            dataFile = jsonDataFiles.weaponsSol;
        }
        
        const weaponData = loadJsonData(dataFile);
        if (!weaponData?.weapons) return null;
        
        let weapon = null;
        if (category) {
            const categoryData = weaponData.weapons[category];
            if (categoryData && Array.isArray(categoryData)) {
                weapon = categoryData.find(w => w.name === weaponName);
            }
        } else {
            // 在所有类别中搜索
            for (const categoryKey in weaponData.weapons) {
                const categoryWeapons = weaponData.weapons[categoryKey];
                if (Array.isArray(categoryWeapons)) {
                    weapon = categoryWeapons.find(w => w.name === weaponName);
                    if (weapon) break;
                }
            }
        }
        
        return weapon;
    },

    /**
     * 获取近战武器数据
     * @returns {Array} - 近战武器列表
     */
    getMeleeWeapons() {
        if (!meleeWeaponsData) {
            meleeWeaponsData = loadJsonData(jsonDataFiles.meleeWeapons);
        }
        
        return meleeWeaponsData?.weapons || [];
    },

    /**
     * 为计算器提供完整数据
     * @returns {Object} - 包含所有计算数据的对象
     */
    getCalculatorData() {
        return {
            weapons: weaponsData,
            weaponsSol: weaponsSolData,  // 烽火地带武器数据
            weaponsMp: weaponsMpData,    // 全面战场武器数据
            armors: armorsData,
            bullets: bulletsData,
            equipment: equipmentData,
            battlefieldWeapons: battlefieldWeaponsData,
            meleeWeapons: meleeWeaponsData
        };
    },

    /**
     * 获取特定武器的完整数据（用于伤害计算）
     * @param {string} weaponName - 武器名称
     * @returns {Object|null} - 武器及其对应子弹的完整数据
     */
    getWeaponDataForCalculation(weaponName) {
        const weapon = this.getWeaponByName(weaponName);
        if (!weapon) return null;
        
        const bullets = this.getBulletsByCaliber(weapon.caliber);
        
        return {
            weapon,
            bullets,
            caliber: weapon.caliber
        };
    },

    // ========== 音频数据访问接口 ==========

    /**
     * 根据中文名或tag获取音频标签
     * @param {string} keyword - 关键词（中文名或tag）
     * @returns {string|null} - tag值
     */
    getAudioTag(keyword) {
        if (!audioTagsData) {
            // 从统一的音频数据文件加载
            const localData = loadRankScoreData(localAudioDataFile, true);
            if (localData && localData.tags && localData.keywords) {
                audioTagsData = { _tags: localData.tags, _keywords: localData.keywords };
                logger.debug('[Delta-Force 数据管理器] 已临时从本地加载音频标签数据');
            } else {
                logger.warn('[Delta-Force 数据管理器] 音频标签数据未就绪');
                return null;
            }
        }

        // 兼容新旧数据格式
        if (audioTagsData._tags && audioTagsData._keywords) {
            // 新格式：分离的双向映射
            // 1. 先检查是否是tag本身
            if (audioTagsData._tags[keyword]) {
                return keyword;
            }
            // 2. 再检查是否是中文关键词
            if (audioTagsData._keywords[keyword]) {
                return audioTagsData._keywords[keyword];
            }
        } else {
            // 旧格式兼容：直接映射表
            if (!audioTagsData[keyword]) {
                return null;
            }

            const value = audioTagsData[keyword];
            
            // 判断是tag本身还是中文映射
            if (this.isTagFormat(value)) {
                return value;
            }
            
            if (this.isTagFormat(keyword)) {
                return keyword;
            }
        }

        return null;
    },

    /**
     * 判断字符串是否是tag格式
     * @param {string} str - 字符串
     * @returns {boolean} - 是否是tag格式
     */
    isTagFormat(str) {
        if (!str || typeof str !== 'string') return false;
        
        // tag格式包括：boss-X, task-X, Evac-X, eggs-X, bf-X, BF_X, 或特定单词
        return str.startsWith('boss-') || 
               str.startsWith('task-') ||
               str.startsWith('Evac-') ||
               str.startsWith('eggs-') ||
               str.startsWith('bf-') ||
               str.startsWith('BF_') ||
               ['haavk', 'commander', 'babel', 'Beginner'].includes(str);
    },

    /**
     * 根据中文名或voiceId获取角色ID
     * @param {string} keyword - 关键词（中文名或voiceId）
     * @returns {string|null} - voiceId值
     */
    getAudioCharacter(keyword) {
        if (!audioCharactersData) {
            // 从统一的音频数据文件加载
            const localData = loadRankScoreData(localAudioDataFile, true);
            if (localData && localData.characters) {
                audioCharactersData = localData.characters;
                logger.debug('[Delta-Force 数据管理器] 已临时从本地加载音频角色数据');
            } else {
                logger.warn('[Delta-Force 数据管理器] 音频角色数据未就绪');
                return null;
            }
        }

        // 直接返回映射值
        return audioCharactersData[keyword] || null;
    },

    /**
     * 根据中文名或英文名获取音频分类
     * @param {string} keyword - 关键词（中文名或英文名）
     * @returns {string|null} - category值
     */
    getAudioCategory(keyword) {
        if (!audioCategoriesData) {
            // 从统一的音频数据文件加载
            const localData = loadRankScoreData(localAudioDataFile, true);
            if (localData && localData.categories) {
                audioCategoriesData = localData.categories;
                logger.debug('[Delta-Force 数据管理器] 已临时从本地加载音频分类数据');
            } else {
                logger.warn('[Delta-Force 数据管理器] 音频分类数据未就绪');
                return null;
            }
        }

        // 直接返回映射值
        return audioCategoriesData[keyword] || null;
    },

    /**
     * 检查是否是有效的音频标签
     * @param {string} keyword - 关键词
     * @returns {boolean} - 是否是有效标签
     */
    isValidAudioTag(keyword) {
        return this.getAudioTag(keyword) !== null;
    },

    /**
     * 检查是否是有效的角色名
     * @param {string} keyword - 关键词
     * @returns {boolean} - 是否是有效角色
     */
    isValidAudioCharacter(keyword) {
        return this.getAudioCharacter(keyword) !== null;
    },

    /**
     * 根据干员名称获取干员图片路径
     * @param {string} operatorName - 干员名称
     * @returns {string|null} - 干员图片路径，如果不存在返回null
     */
    getOperatorImagePath(operatorName) {
        if (!operatorName || operatorName.includes('未知') || operatorName.includes('无')) {
            return null;
        }
        // 清理干员名称，移除可能的括号内容
        const cleanName = operatorName.replace(/\s*\([^)]*\)/, '').trim();
        // 优先使用PNG格式，如果不存在则使用JPG
        return `imgs/operator/${cleanName}.png`;
    },

    /**
     * 根据地图名称获取地图图片路径
     * @param {string} mapName - 地图名称
     * @param {string} mode - 模式 ('sol' 烽火地带 或 'mp' 全面战场)
     * @returns {string|null} - 地图图片路径，如果不存在返回null
     */
    getMapImagePath(mapName, mode = 'sol') {
        if (!mapName || mapName.includes('未知') || mapName.includes('无')) {
            return null;
        }
        // 清理地图名称，移除可能的括号内容
        let cleanName = mapName.trim().replace(/\s*\([^)]*\)/, '');
        
        // 根据模式构建路径
        const prefix = mode === 'sol' ? '烽火-' : '全面-';
        
        // 全面战场模式：从地图名称中提取"-"前面的部分
        // 例如："烬区-攻防" -> "烬区"，匹配"全面-烬区.jpg"
        if (mode === 'mp') {
            if (cleanName.includes('-')) {
                cleanName = cleanName.split('-')[0].trim();
            }
        }
        
        // 烽火地带的地图名称可能需要特殊处理（包含难度等级）
        if (mode === 'sol') {
            // 尝试匹配常见的地图名称格式
            // 例如：零号大坝-常规、长弓溪谷-机密等
            // 如果cleanName不包含"-"，可能需要添加默认难度
            if (!cleanName.includes('-')) {
                // 对于烽火地带，如果没有指定难度，尝试使用"常规"作为默认
                // 但首先尝试直接匹配
                const directPath = `imgs/map/${prefix}${cleanName}.png`;
                // 这里不检查文件是否存在，让HTML的onerror处理
                return directPath;
            }
        }
        
        // 根据模式选择扩展名
        const extension = mode === 'sol' ? '.png' : '.jpg';
        return `imgs/map/${prefix}${cleanName}${extension}`;
    }
    
}; 