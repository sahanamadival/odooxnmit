import { useState, useEffect, useCallback } from 'react';

export const useVoiceCommand = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [isSupported]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    setTranscript('');
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  // Voice command processing
  const processVoiceCommand = useCallback((command) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // Navigation commands
    if (lowerCommand.includes('go to') || lowerCommand.includes('navigate to')) {
      if (lowerCommand.includes('dashboard')) return { type: 'navigate', path: '/dashboard' };
      if (lowerCommand.includes('manufacturing') || lowerCommand.includes('manufacturing orders')) return { type: 'navigate', path: '/manufacturing-orders' };
      if (lowerCommand.includes('work orders')) return { type: 'navigate', path: '/work-orders' };
      if (lowerCommand.includes('stock') || lowerCommand.includes('stock ledger')) return { type: 'navigate', path: '/stock-ledger' };
      if (lowerCommand.includes('reports')) return { type: 'navigate', path: '/reports' };
    }

    // Action commands
    if (lowerCommand.includes('create') || lowerCommand.includes('new')) {
      if (lowerCommand.includes('manufacturing order')) return { type: 'action', action: 'createManufacturingOrder' };
      if (lowerCommand.includes('work order')) return { type: 'action', action: 'createWorkOrder' };
      if (lowerCommand.includes('stock item')) return { type: 'action', action: 'createStockItem' };
    }

    if (lowerCommand.includes('start')) {
      if (lowerCommand.includes('manufacturing order')) return { type: 'action', action: 'startManufacturingOrder' };
      if (lowerCommand.includes('work order')) return { type: 'action', action: 'startWorkOrder' };
    }

    if (lowerCommand.includes('confirm')) {
      return { type: 'action', action: 'confirmOrder' };
    }

    if (lowerCommand.includes('cancel')) {
      return { type: 'action', action: 'cancelOrder' };
    }

    // Search commands
    if (lowerCommand.includes('search') || lowerCommand.includes('find')) {
      const searchTerm = lowerCommand.replace(/search|find|for/gi, '').trim();
      return { type: 'search', term: searchTerm };
    }

    // Help command
    if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      return { type: 'help' };
    }

    return { type: 'unknown', command: lowerCommand };
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
    clearTranscript,
    processVoiceCommand
  };
};
