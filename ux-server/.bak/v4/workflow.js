const response = {
    "functional_spec": "生成一个产品首页",
    "pages": [
        {
            "id": 1291313,
            "name": "产品首页",
            "status": 50,
            "description": "此页面作为产品的门户，通过吸引人的视觉设计和清晰的价值主张，向用户介绍产品。它引导用户探索产品列表、了解产品详情、探索关于我们或联系我们。",
            "position": null,
            "can_hard_delete": false,
            "navigation_list": [
                {
                    "id": 1957255,
                    "name": "查看产品列表",
                    "trigger": "点击立即探索",
                    "target_page_id": 1291314,
                    "is_new": false
                },
                {
                    "id": 1957256,
                    "name": "关于我们",
                    "trigger": "点击导航栏中的关于我们",
                    "target_page_id": 1291316,
                    "is_new": false
                },
                {
                    "id": 1957257,
                    "name": "联系我们",
                    "trigger": "点击导航栏中的联系我们",
                    "target_page_id": 1291317,
                    "is_new": false
                },
                {
                    "id": 1957258,
                    "name": "核心功能",
                    "trigger": "点击顶部导航的核心功能链接",
                    "target_page_id": 1291318,
                    "is_new": false
                },
                {
                    "id": 1957259,
                    "name": "了解更多/注册",
                    "trigger": "点击行动呼吁按钮",
                    "target_page_id": 1291321,
                    "is_new": false
                },
                {
                    "id": 1957260,
                    "name": "查看用户指南",
                    "trigger": "点击用户指南链接",
                    "target_page_id": 1291324,
                    "is_new": false
                },
                {
                    "id": 1957261,
                    "name": "常见问题",
                    "trigger": "点击常见问题链接",
                    "target_page_id": 1291325,
                    "is_new": false
                }
            ],
            "is_core": true
        },
        {
            "id": 1291314,
            "name": "产品列表",
            "status": -2,
            "description": "此页面旨在展示所有可用产品，提供可筛选的视图和搜索功能，方便用户快速找到所需。用户可从此处点击进入任一产品的详细信息页面，并能够返回到产品首页。",
            "position": null,
            "can_hard_delete": true,
            "navigation_list": [
                {
                    "id": 1957262,
                    "name": "查看产品详情",
                    "trigger": "点击任意产品卡片",
                    "target_page_id": 1291315,
                    "is_new": false
                },
                {
                    "id": 1957263,
                    "name": "返回产品首页",
                    "trigger": "点击网站Logo",
                    "target_page_id": 1291313,
                    "is_new": false
                },
                {
                    "id": 1957264,
                    "name": "核心功能",
                    "trigger": "点击功能相关产品链接",
                    "target_page_id": 1291319,
                    "is_new": false
                },
                {
                    "id": 1957265,
                    "name": "返回行动呼吁区域",
                    "trigger": "点击返回按钮",
                    "target_page_id": 1291321,
                    "is_new": false
                }
            ],
            "is_core": true
        },
        {
            "id": 1291315,
            "name": "产品详情页",
            "status": 50,
            "description": "此页面提供产品的全面信息，包括详细描述、图片、价格、规格和用户评价。用户可以进行购买或添加到购物车，并能方便地返回产品列表页或产品首页。",
            "position": null,
            "can_hard_delete": false,
            "navigation_list": [
                {
                    "id": 1957266,
                    "name": "返回产品列表",
                    "trigger": "点击返回按钮",
                    "target_page_id": 1291314,
                    "is_new": false
                },
                {
                    "id": 1957267,
                    "name": "返回产品首页",
                    "trigger": "点击网站Logo",
                    "target_page_id": 1291313,
                    "is_new": false
                }
            ],
            "is_core": true
        },
        {
            "id": 1291316,
            "name": "关于产品",
            "status": -3,
            "description": "此页面介绍产品的品牌故事、愿景和核心价值，增强用户对产品的信任感和认同感。它允许用户返回产品首页。",
            "position": null,
            "can_hard_delete": true,
            "navigation_list": [
                {
                    "id": 1957268,
                    "name": "购买产品",
                    "trigger": "点击产品链接",
                    "target_page_id": 1291314,
                    "is_new": false
                },
                {
                    "id": 1957269,
                    "name": "返回产品首页",
                    "trigger": "点击网站Logo",
                    "target_page_id": 1291313,
                    "is_new": false
                }
            ],
            "is_core": false
        },
        {
            "id": 1291317,
            "name": "联系我们",
            "status": -3,
            "description": "此页面提供多种联系方式，如邮箱、电话和在线表单，方便用户咨询和获取帮助。用户可以通过此页面与团队取得联系，并能返回产品首页。",
            "position": null,
            "can_hard_delete": true,
            "navigation_list": [
                {
                    "id": 1957270,
                    "name": "返回产品首页",
                    "trigger": "点击网站Logo",
                    "target_page_id": 1291313,
                    "is_new": false
                }
            ],
            "is_core": false
        },
        {
            "id": 1291318,
            "name": "核心功能概览",
            "status": -2,
            "description": "此页面集中展示产品的所有核心功能，每个功能都配有简短描述和视觉示例，旨在让用户快速理解产品价值。它引导用户深入查看单个功能的详细信息或探索应用场景。",
            "position": null,
            "can_hard_delete": true,
            "navigation_list": [
                {
                    "id": 1957271,
                    "name": "查看功能详情",
                    "trigger": "点击功能卡片",
                    "target_page_id": 1291319,
                    "is_new": false
                },
                {
                    "id": 1957272,
                    "name": "查看使用案例",
                    "trigger": "点击使用案例按钮",
                    "target_page_id": 1291320,
                    "is_new": false
                },
                {
                    "id": 1957273,
                    "name": "返回产品首页",
                    "trigger": "点击返回按钮",
                    "target_page_id": 1291313,
                    "is_new": false
                }
            ],
            "is_core": true
        },
        {
            "id": 1291319,
            "name": "功能详情",
            "status": -2,
            "description": "此页面提供单个核心功能的深入介绍，包括详细工作原理、技术规格和优势，并通过互动演示或视频进行说明。用户可以返回核心功能概览页面，或直接跳转到产品列表页。",
            "position": null,
            "can_hard_delete": true,
            "navigation_list": [
                {
                    "id": 1957274,
                    "name": "返回核心功能概览",
                    "trigger": "点击返回按钮",
                    "target_page_id": 1291318,
                    "is_new": false
                },
                {
                    "id": 1957275,
                    "name": "查看相关产品",
                    "trigger": "点击查看产品按钮",
                    "target_page_id": 1291314,
                    "is_new": false
                }
            ],
            "is_core": true
        },
        {
            "id": 1291320,
            "name": "使用案例",
            "status": -2,
            "description": "此页面展示产品在不同行业或用户场景中的实际应用，通过案例研究和客户评价突出产品的有效性。用户可以查看完整的案例详情，或返回核心功能概览。",
            "position": null,
            "can_hard_delete": true,
            "navigation_list": [
                {
                    "id": 1957276,
                    "name": "返回核心功能概览",
                    "trigger": "点击返回按钮",
                    "target_page_id": 1291318,
                    "is_new": false
                }
            ],
            "is_core": true
        },
        {
            "id": 1291321,
            "name": "行动呼吁区域",
            "status": -3,
            "description": "此区域旨在通过突出显示的核心操作（如注册、查看价格或立即购买）引导用户。它提供清晰的按钮和简要的说明，鼓励用户采取下一步行动。",
            "position": null,
            "can_hard_delete": true,
            "navigation_list": [
                {
                    "id": 1957277,
                    "name": "注册",
                    "trigger": "点击注册按钮",
                    "target_page_id": 1291322,
                    "is_new": false
                },
                {
                    "id": 1957278,
                    "name": "查看定价",
                    "trigger": "点击查看定价按钮",
                    "target_page_id": 1291323,
                    "is_new": false
                },
                {
                    "id": 1957279,
                    "name": "立即购买",
                    "trigger": "点击立即购买按钮",
                    "target_page_id": 1291314,
                    "is_new": false
                },
                {
                    "id": 1957280,
                    "name": "返回产品首页",
                    "trigger": "点击返回按钮",
                    "target_page_id": 1291313,
                    "is_new": false
                }
            ],
            "is_core": true
        },
        {
            "id": 1291322,
            "name": "注册表单",
            "status": -3,
            "description": "此页面用于收集用户的注册信息，包括电子邮件、密码等，且可能包含服务条款和隐私政策的链接。成功注册后，用户可以进一步探索产品或返回行动呼吁区域。",
            "position": null,
            "can_hard_delete": true,
            "navigation_list": [
                {
                    "id": 1957281,
                    "name": "完成注册",
                    "trigger": "点击提交按钮",
                    "target_page_id": 1291321,
                    "is_new": false
                },
                {
                    "id": 1957282,
                    "name": "返回产品首页",
                    "trigger": "点击取消或返回按钮",
                    "target_page_id": 1291313,
                    "is_new": false
                }
            ],
            "is_core": true
        },
        {
            "id": 1291323,
            "name": "定价方案",
            "status": -3,
            "description": "此页面展示产品的不同订阅或购买方案，包含各方案的特点、价格和对比信息。用户可以在此选择适合的方案并前往购买，或返回行动呼吁区域。",
            "position": null,
            "can_hard_delete": true,
            "navigation_list": [
                {
                    "id": 1957283,
                    "name": "选择方案并购买",
                    "trigger": "点击购买按钮",
                    "target_page_id": 1291314,
                    "is_new": false
                },
                {
                    "id": 1957284,
                    "name": "返回行动呼吁区域",
                    "trigger": "点击返回按钮",
                    "target_page_id": 1291321,
                    "is_new": false
                },
                {
                    "id": 1957285,
                    "name": "返回产品首页",
                    "trigger": "点击首页链接",
                    "target_page_id": 1291313,
                    "is_new": false
                }
            ],
            "is_core": true
        },
        {
            "id": 1291324,
            "name": "用户指南",
            "status": -3,
            "description": "此页面提供产品的详细使用教程、操作步骤和最佳实践，帮助用户快速上手和充分利用产品功能。用户可以回到产品首页或查看常见问题。",
            "position": null,
            "can_hard_delete": true,
            "navigation_list": [
                {
                    "id": 1957286,
                    "name": "查看常见问题",
                    "trigger": "点击常见问题链接",
                    "target_page_id": 1291325,
                    "is_new": false
                },
                {
                    "id": 1957287,
                    "name": "返回产品首页",
                    "trigger": "点击返回按钮",
                    "target_page_id": 1291313,
                    "is_new": false
                }
            ],
            "is_core": true
        },
        {
            "id": 1291325,
            "name": "常见问题解答",
            "status": -3,
            "description": "此页面收集了用户在使用产品过程中可能遇到的常见问题及其解答，旨在帮助用户自助解决疑惑。用户可以返回产品首页或用户指南页面。",
            "position": null,
            "can_hard_delete": true,
            "navigation_list": [
                {
                    "id": 1957288,
                    "name": "返回用户指南",
                    "trigger": "点击返回指南按钮",
                    "target_page_id": 1291324,
                    "is_new": false
                },
                {
                    "id": 1957289,
                    "name": "返回产品首页",
                    "trigger": "点击返回按钮",
                    "target_page_id": 1291313,
                    "is_new": false
                }
            ],
            "is_core": true
        },
        {
            "id": 1296622,
            "name": "",
            "status": -4,
            "description": "",
            "position": null,
            "can_hard_delete": true,
            "navigation_list": [],
            "is_core": false
        }
    ],
    "workflows": [
        {
            "id": 266099,
            "name": "产品展示流程     ",
            "description": "用户通过引人注目的视觉元素和简明扼要的文字，快速掌握产品概况和主要卖点。",
            "workflow_tree": {
                "page_id": 1291313,
                "navigation_id": null,
                "position": "{\"x\":125,\"y\":499}",
                "children": [
                    {
                        "page_id": 1291316,
                        "navigation_id": 1957256,
                        "position": "{\"x\":425,\"y\":532}",
                        "children": []
                    },
                    {
                        "page_id": 1291317,
                        "navigation_id": 1957257,
                        "position": "{\"x\":425,\"y\":837}",
                        "children": []
                    }
                ]
            },
            "status": 3
        },
        {
            "id": 266100,
            "name": "核心功能介绍流程",
            "description": "用户深入了解产品的各项关键功能，并通过具体案例或图示理解其应用场景和带来的价值。",
            "workflow_tree": {
                "page_id": 1291313,
                "navigation_id": null,
                "position": "{\"x\":125,\"y\":1363}",
                "children": [
                    {
                        "page_id": 1291318,
                        "navigation_id": 1957255,
                        "position": "{\"x\":444,\"y\":1350}",
                        "children": [
                            {
                                "page_id": 1291319,
                                "navigation_id": 1957271,
                                "position": "{\"x\":725,\"y\":1219}",
                                "children": [
                                    {
                                        "page_id": 1291314,
                                        "navigation_id": 1957275,
                                        "position": "{\"x\":1025,\"y\":1219}",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "page_id": 1291320,
                                "navigation_id": 1957272,
                                "position": "{\"x\":725,\"y\":1524}",
                                "children": []
                            }
                        ]
                    }
                ]
            },
            "status": 3
        },
        {
            "id": 266101,
            "name": "用户引导与行动呼吁流程",
            "description": "通过清晰的指引和突出的行动按钮，鼓励用户注册、购买或了解更多信息。",
            "workflow_tree": {
                "page_id": 1291313,
                "navigation_id": null,
                "position": "{\"x\":125,\"y\":2570}",
                "children": [
                    {
                        "page_id": 1291321,
                        "navigation_id": 1957259,
                        "position": "{\"x\":425,\"y\":2088}",
                        "children": [
                            {
                                "page_id": 1291322,
                                "navigation_id": 1957277,
                                "position": "{\"x\":725,\"y\":1911}",
                                "children": []
                            },
                            {
                                "page_id": 1291323,
                                "navigation_id": 1957278,
                                "position": "{\"x\":725,\"y\":2232}",
                                "children": []
                            },
                            {
                                "page_id": 1291314,
                                "navigation_id": 1957279,
                                "position": "{\"x\":725,\"y\":2587}",
                                "children": []
                            }
                        ]
                    },
                    {
                        "page_id": 1291324,
                        "navigation_id": 1957260,
                        "position": "{\"x\":425,\"y\":2459}",
                        "children": []
                    },
                    {
                        "page_id": 1291325,
                        "navigation_id": 1957261,
                        "position": "{\"x\":425,\"y\":2764}",
                        "children": []
                    }
                ]
            },
            "status": 3
        },
        {
            "id": 266102,
            "name": "页脚信息与导航流程",
            "description": "用户在页面底部找到版权信息、联系方式、隐私政策等辅助内容以及其他重要页面的链接。",
            "workflow_tree": null,
            "status": 0
        },
        {
            "id": 267158,
            "name": "",
            "description": "",
            "workflow_tree": {
                "page_id": 1291314,
                "navigation_id": null,
                "position": "{\"x\":425,\"y\":161}",
                "children": [
                    {
                        "page_id": 1291315,
                        "navigation_id": 1957262,
                        "position": "{\"x\":725,\"y\":161}",
                        "children": []
                    }
                ]
            },
            "status": 10
        }
    ]
}