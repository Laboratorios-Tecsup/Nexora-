import requests
from decouple import config

HF_TOKEN = config('HF_TOKEN')

def generar_imagen_publicitaria(foto_producto_path, foto_modelo_path,
                                 nombre_negocio, descripcion_producto,
                                 publico_objetivo, tono, red_social):
    """
    Genera imagen publicitaria usando Stable Diffusion XL
    desde Hugging Face Inference API
    """

    # Prompt optimizado para publicidad
    prompt = f"""Professional advertising photo for {nombre_negocio}, 
    product: {descripcion_producto}, 
    target audience: {publico_objetivo}, 
    tone: {tono}, platform: {red_social}.
    High quality commercial photography, professional lighting, 
    modern aesthetic, photorealistic, 8K resolution, 
    stunning product advertisement"""

    negative_prompt = """blurry, low quality, distorted, 
    watermark, text, logo, bad anatomy, ugly"""

    # Llama a Stable Diffusion XL en Hugging Face
    API_URL = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell"
    
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "inputs": prompt,
        "parameters": {
            "negative_prompt": negative_prompt,
            "num_inference_steps": 30,
            "guidance_scale": 7.5,
            "width": 1024,
            "height": 1024,
        }
    }

    response = requests.post(API_URL, headers=headers, json=payload, timeout=120)

    if response.status_code == 200:
        return response.content, 'image/png'
    else:
        raise Exception(f"Error Hugging Face: {response.status_code} - {response.text}")