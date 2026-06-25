// script.js - Arquivo JavaScript separado
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

  // Função principal de geração de senha
  function generatePassword() {
    const length = parseInt(lengthSlider.value, 10);
    let charSet = '';
    let password = '';

    // Monta o conjunto de caracteres baseado nas opções
    if (includeUppercase.checked) charSet += UPPER;
    if (includeLowercase.checked) charSet += LOWER;
    if (includeNumbers.checked) charSet += NUMBERS;
    if (includeSymbols.checked) charSet += SYMBOLS;

    // Validação: se nenhuma opção estiver marcada, usar padrão (minúsculas + números)
    if (charSet.length === 0) {
      charSet = LOWER + NUMBERS;
      // Opcional: marcar alguns checkboxes para feedback visual
      includeLowercase.checked = true;
      includeNumbers.checked = true;
    }

    // Gera a senha com segurança (usando crypto.getRandomValues)
    const charArray = charSet.split('');
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      const index = randomValues[i] % charArray.length;
      password += charArray[index];
    }

    // Garantir que a senha contenha pelo menos um caractere de cada tipo selecionado
    // (para maior segurança, mas mantendo a aleatoriedade)
    let ensured = false;
    // Se o usuário selecionou vários tipos, tentamos incluir pelo menos um de cada
    const selectedTypes = [];
    if (includeUppercase.checked) selectedTypes.push(UPPER);
    if (includeLowercase.checked) selectedTypes.push(LOWER);
    if (includeNumbers.checked) selectedTypes.push(NUMBERS);
    if (includeSymbols.checked) selectedTypes.push(SYMBOLS);

    if (selectedTypes.length > 1 && length >= selectedTypes.length) {
      // Faz uma segunda passagem para garantir diversidade (substitui caracteres)
      let passwordArray = password.split('');
      // Embaralha posições para inserir caracteres obrigatórios
      for (let i = 0; i < selectedTypes.length; i++) {
        const typeChars = selectedTypes[i];
        const randomIndex = Math.floor(Math.random() * passwordArray.length);
        // Pega um caractere aleatório do tipo correspondente
        const charSetType = typeChars;
        const randomChar = charSetType[Math.floor(Math.random() * charSetType.length)];
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

  // Evento do botão gerar
  generateBtn.addEventListener('click', refreshPassword);

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
  window.addEventListener('DOMContentLoaded', () => {
    refreshPassword();
  });

  // Opção extra: ao alterar qualquer checkbox ou slider, regenerar automaticamente?
  // (deixamos manual, mas podemos adicionar um "refresh" automático se preferir)
  // Vamos adicionar um pequeno atalho: duplo clique no display gera nova senha
  passwordDisplay.addEventListener('dblclick', refreshPassword);

  // E também ao pressionar Enter no slider (para acessibilidade)
  lengthSlider.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      refreshPassword();
    }
  });

  // Ajuste fino: se o usuário marcar/desmarcar opções, podemos regenerar? 
  // Vamos manter a geração manual, mas com um "toque" extra: 
  // ao clicar em qualquer checkbox, se o usuário quiser, pode gerar novamente.
  // Mas não forçamos para não sobrecarregar. Vamos apenas adicionar um indicador visual.
  const optionCheckboxes = [includeUppercase, includeLowercase, includeNumbers, includeSymbols];
  optionCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      // Pequeno feedback: mudar opacidade do display
      passwordDisplay.style.opacity = '0.7';
      setTimeout(() => passwordDisplay.style.opacity = '1', 300);
    });
  });

})();
