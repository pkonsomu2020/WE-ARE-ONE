# Ollama Setup for WAO-CHAT

## Prerequisites
- Ollama installed and running
- Llama 2 model downloaded

## Environment Variables
Add these to your `.env` file:

```env
# Ollama Configuration
OLLAMA_BASE_URL=https://your-ollama-server.com
OLLAMA_MODEL=llama2:7b
```

## Installation Steps

1. **Install Ollama** (if not already done):
   ```bash
   # Windows
   winget install Ollama.Ollama
   
   # macOS
   brew install ollama
   
   # Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Start Ollama Service**:
   ```bash
   ollama serve
   ```

3. **Download Llama 2 Model**:
   ```bash
   ollama pull llama2:7b
   ```

4. **Test the Model**:
   ```bash
   ollama run llama2:7b "Hello, how are you?"
   ```

## Backend Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Start the Backend**:
   ```bash
   npm start
   ```

3. **Test Ollama Connection**:
   ```bash
   curl https://weareone.co.ke/api/chat/health
   ```

## Troubleshooting

### Ollama Not Running
- Make sure Ollama is installed and running
- Check if port 11434 is available
- Restart Ollama: `ollama serve`

### Model Not Found
- Download the model: `ollama pull llama2:7b`
- Check available models: `ollama list`

### Connection Issues
- Verify Ollama is running on your production server
- Check firewall settings
- Ensure backend can reach Ollama API

## Alternative Models

You can use different models by changing `OLLAMA_MODEL` in your `.env`:

- `llama2:7b` - Good balance of speed and quality
- `llama2:13b` - Better quality, slower
- `mistral:7b` - Fast and efficient
- `codellama:7b` - Good for technical conversations

## Performance Tips

- Use smaller models for faster responses
- Adjust `max_tokens` in the controller for response length
- Consider using `stream: true` for real-time responses 