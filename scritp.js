// script.js - Arquivo JavaScript separado (CORRIGIDO)
(function() {
  "use strict";

  // Elementos DOM
  const passwordDisplay = document.getElementById('passwordDisplay');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const lengthSlider = document.getElementById('lengthSlider');
  const lengthValue = document.getElementById('lengthValue');

  const includeUppercase = document.getElementById('includeUppercase');
  const includeLowercase = document.getElementById('includeLowercase');
  const includeNumbers = document.getElementById('includeNumbers');
  const includeSymbols = document.getElementById('includeSymbols');

  // Conjuntos de caracteres
  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const NUMBERS = '0123456789';
  const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // Atualiza o valor do comprimento exibido
  function updateLengthLabel() {
    lengthValue.textContent = lengthSlider.value;
  }
  lengthSlider.addEventListener('input', updateLengthLabel);
  updateLengthLabel();

  // Função principal de geração de senha (CORRIGIDA)
  function generatePassword() {
    const length = parseInt(lengthSlider.value, 10);
    let charSet = '';

    // Monta o conjunto de caracteres baseado nas opções
    if (includeUppercase.checked) charSet += UPPER;
    if (includeLowercase.checked) charSet += LOWER;
    if (includeNumbers.checked) charSet += NUMBERS;
    if (includeSymbols.checked) charSet += SYMBOLS;

    // Validação: se nenhuma opção estiver marcada, usar padrão (minúsculas + números)
    if (charSet.length === 0) {
      charSet = LOWER + NUMBERS;
      includeLowercase.checked = true;
      includeNumbers.checked = true;
    }

    // Gera a senha usando crypto.getRandomValues
    const charArray = charSet.split('');
    let password = '';
    
    // Usando Uint8Array para melhor performance
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    
    for (let i = 0; i < length; i++) {
      const index = randomBytes[i] % charArray.length;
      password += charArray[index];
    }

    // Garantir que a senha contenha pelo menos um caractere de cada tipo selecionado
    const selectedTypes = [];
    if (includeUppercase.checked) selectedTypes.push(UPPER);
    if (includeLowercase.checked) selectedTypes.push(LOWER);
    if (includeNumbers.checked) selectedTypes.push(NUMBERS);
    if (includeSymbols.checked) selectedTypes.push(SYMBOLS);

    // Se temos múltiplos tipos e o comprimento é suficiente, garantir diversidade
    if (selectedTypes.length > 1 && length >= selectedTypes.length) {
      let passwordArray = password.split('');
      // Embaralha posições para inserir caracteres obrigatórios
      for (let i = 0; i < selectedTypes.length; i++) {
        const typeChars = selectedTypes[i];
        // Escolhe uma posição aleatória que ainda não foi modificada
        let randomIndex;
        let attempts = 0;
        do {
          randomIndex = Math.floor(Math.random() * passwordArray.length);
          attempts++;
        } while (attempts < 20 && passwordArray[randomIndex] === '#'); // Evita loop infinito
        
        // Pega um caractere aleatório do tipo correspondente
        const randomChar = typeChars[Math.floor(Math.random() * typeChars.length)];
        passwordArray[randomIndex] = randomChar;
      }
      password = passwordArray.join('');
    }

    return password;
  }

  // Atualiza a senha no display
  function refreshPassword() {
    const newPassword = generatePassword();
    passwordDisplay.textContent = newPassword;
  }

  // Evento do botão gerar (CORRIGIDO)
  generateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    refreshPassword();
  });

  // Evento do botão copiar
  copyBtn.addEventListener('click', async function() {
    const password = passwordDisplay.textContent;
    if (!password || password === 'Clique em gerar' || password === '') {
      alert('Nenhuma senha para copiar. Gere uma senha primeiro!');
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      // Feedback visual rápido
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✅ Copiado!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 1800);
    } catch (err) {
      alert('Não foi possível copiar. Tente manualmente.');
      console.error('Erro ao copiar: ', err);
    }
  });

  // Gera uma senha ao carregar a página
  window.addEventListener('DOMContentLoaded', function() {
    refreshPassword();
  });

  // Duplo clique no display gera nova senha
  passwordDisplay.addEventListener('dblclick', refreshPassword);

  // Enter no slider gera nova senha
  lengthSlider.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      refreshPassword();
    }
  });

  // Feedback visual ao alterar checkboxes
  const optionCheckboxes = [includeUppercase, includeLowercase, includeNumbers, includeSymbols];
  optionCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      passwordDisplay.style.opacity = '0.7';
      setTimeout(function() {
        passwordDisplay.style.opacity = '1';
      }, 300);
    });
  });

  // Teste rápido para verificar se a função está funcionando
  console.log('Gerador de Senhas inicializado!');
  console.log('Senha de teste:', generatePassword());
})();
