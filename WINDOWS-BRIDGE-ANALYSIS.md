# Windows Computer Use API Bridge — Technical Analysis

**Date:** 2026-03-28  
**Task:** EPIC-010-STORY-004 — Bridge 1: Build lightweight Windows Computer Use API bridge service  
**Author:** Franky (Chief Engineer)  
**Priority:** P0  
**Estimate:** 2-4 days

## Objective Analysis

Build a lightweight Python bridge service that runs on Windows machines and exposes the minimum API surface needed for crew dispatch to Claude Computer Use capabilities.

## Context from Research (COMPUTER-USE-RESEARCH.md)

### Strategic Vision
- Revive idle Windows hardware (Desktop + GPU3060) as remote Computer Use worker nodes
- Enable OpenClaw crew to dispatch tasks to Windows machines via Tailscale mesh + API bridge
- Expand crew capacity beyond Mac Mini limitations

### Architecture Requirements (Phase 2)
From the research document, the bridge service needs:

```
Mac Mini (OpenClaw Gateway)
    ↓ HTTP API calls via Tailscale
Windows Machine (Desktop or GPU3060)
    → Bridge API Service (Python Flask)
    → Claude Computer Use (via Anthropic API)
    ↓ Results (screenshots, text, artifacts)
Mac Mini (OpenClaw Gateway)
    → Agent receives results, posts to Telegram
```

### Required API Endpoints
1. **`POST /task`** — Accept task description, execute via Anthropic Computer Use API
2. **`GET /status/{task_id}`** — Return task progress and current state
3. **`GET /result/{task_id}`** — Return screenshots, text output, file artifacts

## Technical Implementation Analysis

### Core Components Required

#### 1. HTTP API Server (Python Flask)
- **Framework**: Flask or FastAPI for lightweight HTTP server
- **Authentication**: Basic auth or API key for security
- **CORS**: Allow cross-origin requests from Mac Mini
- **Logging**: Comprehensive request/response logging for debugging

#### 2. Task Management System
- **Task Queue**: In-memory or lightweight database (SQLite)
- **Task States**: pending, running, completed, failed, timeout
- **Task Storage**: Store task descriptions, results, metadata
- **Cleanup**: Remove old completed tasks to prevent storage bloat

#### 3. Computer Use Integration
- **Anthropic API Client**: Official anthropic-sdk-python
- **Screen Capture**: Windows-specific screenshot functionality
- **Input Injection**: Mouse/keyboard control via win32api or pyautogui
- **File Management**: Handle file artifacts and uploads

#### 4. Result Management
- **Screenshot Storage**: Temporary storage for screen captures
- **Text Extraction**: Capture and format text outputs
- **File Artifacts**: Handle file downloads/uploads from Computer Use
- **Result Serialization**: JSON formatting for API responses

### Python Dependencies Analysis

#### Core Framework
```python
flask>=2.3.0          # Lightweight HTTP API server
requests>=2.31.0      # HTTP client for API calls
anthropic>=0.5.0      # Official Anthropic SDK
```

#### Windows-Specific
```python
pywin32>=306          # Windows API access (win32api)
pillow>=10.0.0        # Image processing (screenshots)
pyautogui>=0.9.54     # Mouse/keyboard automation
psutil>=5.9.5         # System monitoring
```

#### Development & Utilities
```python
python-dotenv>=1.0.0  # Environment variable management
pydantic>=2.4.0       # Data validation and serialization
uvicorn>=0.23.0       # ASGI server (if using FastAPI)
pytest>=7.4.0         # Testing framework
```

### Architecture Decisions

#### Option A: Flask + Threading
- **Pros**: Simple, well-documented, good for prototyping
- **Cons**: Limited concurrent task handling
- **Best for**: Initial implementation, single-task scenarios

#### Option B: FastAPI + AsyncIO
- **Pros**: Better concurrency, automatic API documentation, modern Python
- **Cons**: Slightly more complex setup
- **Best for**: Production deployment, multiple concurrent tasks

#### Recommendation: Start with Flask for rapid prototyping

### Security Considerations

#### Network Security
- **Tailscale Integration**: Bridge only listens on Tailscale IP
- **API Authentication**: Require API key or basic auth
- **Rate Limiting**: Prevent abuse from excessive requests
- **Request Validation**: Sanitize all inputs

#### Computer Use Safety
- **Task Isolation**: Each task in separate session/context
- **File System Limits**: Restrict file access to specific directories
- **Resource Limits**: Timeout long-running tasks
- **Audit Logging**: Log all Computer Use actions for review

### Development Plan

#### Phase 1: Core API Framework (Day 1)
1. **Setup Development Environment**
   - Python 3.11+ on Windows
   - Install dependencies
   - Create project structure

2. **Basic Flask API**
   - `/health` endpoint for connectivity testing
   - `/task` endpoint (basic structure)
   - `/status/{task_id}` endpoint
   - `/result/{task_id}` endpoint

3. **Task Management**
   - SQLite database for task storage
   - Basic task state management
   - UUID generation for task IDs

#### Phase 2: Computer Use Integration (Day 2)
1. **Anthropic API Integration**
   - Configure API credentials
   - Basic Computer Use API calls
   - Screenshot capture and encoding

2. **Task Execution Engine**
   - Background task processing
   - Progress tracking and updates
   - Error handling and recovery

3. **Result Handling**
   - Screenshot storage and retrieval
   - Text output capture
   - File artifact management

#### Phase 3: Testing and Hardening (Day 3-4)
1. **End-to-End Testing**
   - Mac Mini to Windows bridge communication
   - Full Computer Use task execution
   - Result retrieval and validation

2. **Security Implementation**
   - Authentication and authorization
   - Input validation and sanitization
   - Rate limiting and abuse protection

3. **Performance Optimization**
   - Concurrent task handling
   - Memory and storage management
   - Resource cleanup and monitoring

### Integration with OpenClaw Crew

#### Task Dispatch Pattern
```python
# From Mac Mini OpenClaw agent:
import requests

response = requests.post(
    f"http://{windows_bridge_ip}:8000/task",
    json={
        "description": "Take a screenshot and count desktop icons",
        "timeout": 300,
        "priority": "normal"
    },
    auth=("api", "bridge_api_key")
)

task_id = response.json()["task_id"]

# Poll for completion
result = requests.get(f"http://{windows_bridge_ip}:8000/result/{task_id}")
```

#### OpenClaw Integration Points
1. **Subagent Assignment**: Cola or Cavendish can handle bridge tasks
2. **Cron Chain Integration**: Add bridge tasks to automation patterns
3. **Follow-up Generation**: Auto-create QA tasks for Computer Use results
4. **Telegram Reporting**: Post screenshots and results to appropriate topics

### File Structure Plan
```
windows-computer-use-bridge/
├── bridge/
│   ├── __init__.py
│   ├── api.py              # Flask/FastAPI application
│   ├── tasks.py            # Task management and execution
│   ├── computer_use.py     # Anthropic API integration
│   ├── storage.py          # Data storage and retrieval
│   └── security.py         # Authentication and validation
├── tests/
│   ├── test_api.py         # API endpoint tests
│   ├── test_tasks.py       # Task execution tests
│   └── test_integration.py # End-to-end tests
├── config/
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment configuration
├── deployment/
│   ├── install.ps1         # Windows installation script
│   └── service.bat         # Windows service wrapper
└── docs/
    ├── API.md              # API documentation
    ├── INSTALL.md          # Installation guide
    └── TROUBLESHOOTING.md  # Common issues and solutions
```

## Risk Analysis

### Technical Risks
- **Windows API Compatibility**: Different behavior across Windows versions
- **Anthropic API Limits**: Rate limiting and quota management
- **Network Connectivity**: Tailscale reliability and latency
- **Resource Management**: Memory/CPU usage on Windows machines

### Operational Risks
- **Security Exposure**: Computer Use gives full desktop access
- **Task Isolation**: Concurrent tasks might interfere
- **Error Recovery**: Failed tasks could leave desktop in inconsistent state
- **Monitoring**: Limited visibility into remote Windows machine health

### Mitigation Strategies
- **Comprehensive Testing**: Test on both target Windows machines
- **Resource Monitoring**: Track CPU, memory, and network usage
- **Task Timeouts**: Prevent runaway processes
- **Audit Logging**: Complete activity tracking for security
- **Recovery Procedures**: Automated cleanup for failed tasks

## Success Criteria

### Minimum Viable Product
1. **API Functionality**: All three endpoints working correctly
2. **Computer Use Integration**: Basic task execution with screenshots
3. **Mac Mini Connectivity**: Successful dispatch from OpenClaw agents
4. **Security**: Basic authentication and input validation

### Production Ready
1. **Concurrent Tasks**: Multiple simultaneous Computer Use sessions
2. **Error Handling**: Graceful failure recovery
3. **Performance**: <5 second response time for simple tasks
4. **Monitoring**: Health checks and performance metrics
5. **Documentation**: Complete installation and operation guides

---

**Next Steps:**
1. Set up development environment on Windows Desktop machine
2. Implement core Flask API with basic task management
3. Integrate Anthropic Computer Use API
4. Test end-to-end connectivity from Mac Mini

**Implementation Timeline:**
- **Day 1**: Core API framework and task management
- **Day 2**: Computer Use integration and execution engine
- **Day 3**: End-to-end testing and security implementation
- **Day 4**: Performance optimization and documentation

This analysis provides the foundation for implementing the Windows Computer Use API bridge service according to the crew's requirements and architectural vision.