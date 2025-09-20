import React, { useState, useEffect } from 'react';
import { useVoiceCommand } from '../hooks/useVoiceCommand';

const VoiceCommand = ({ onCommand, onNavigate, onAction }) => {
  const {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
    clearTranscript,
    processVoiceCommand
  } = useVoiceCommand();

  const [showHelp, setShowHelp] = useState(false);
  const [lastCommand, setLastCommand] = useState('');

  useEffect(() => {
    if (transcript && transcript !== lastCommand) {
      const command = processVoiceCommand(transcript);
      setLastCommand(transcript);
      
      if (command.type === 'navigate' && onNavigate) {
        onNavigate(command.path);
      } else if (command.type === 'action' && onAction) {
        onAction(command.action);
      } else if (command.type === 'search' && onCommand) {
        onCommand('search', command.term);
      } else if (command.type === 'help') {
        setShowHelp(true);
      } else if (command.type === 'unknown' && onCommand) {
        onCommand('unknown', command.command);
      }
    }
  }, [transcript, processVoiceCommand, onCommand, onNavigate, onAction, lastCommand]);

  const helpCommands = [
    { command: 'Go to dashboard', description: 'Navigate to main dashboard' },
    { command: 'Go to manufacturing orders', description: 'Navigate to manufacturing orders' },
    { command: 'Go to work orders', description: 'Navigate to work orders' },
    { command: 'Go to stock ledger', description: 'Navigate to stock ledger' },
    { command: 'Create manufacturing order', description: 'Create a new manufacturing order' },
    { command: 'Create work order', description: 'Create a new work order' },
    { command: 'Start manufacturing order', description: 'Start a manufacturing order' },
    { command: 'Confirm order', description: 'Confirm current order' },
    { command: 'Cancel order', description: 'Cancel current order' },
    { command: 'Search for [term]', description: 'Search for specific items' },
    { command: 'Help', description: 'Show this help menu' }
  ];

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          Voice commands are not supported in this browser. Please use Chrome or Edge for voice functionality.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Voice Commands</h3>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {showHelp ? 'Hide Help' : 'Show Help'}
        </button>
      </div>

      {showHelp && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Available Commands:</h4>
          <div className="space-y-1 text-sm">
            {helpCommands.map((help, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-medium text-gray-700">"{help.command}"</span>
                <span className="text-gray-600">{help.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            isListening 
              ? 'voice-recording' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isListening ? '🛑 Stop Listening' : '🎤 Start Listening'}
        </button>
        
        <button
          onClick={clearTranscript}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
        >
          Clear
        </button>
      </div>

      {transcript && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">You said:</span> {transcript}
          </p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {isListening && (
        <div className="flex items-center space-x-2 text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Listening...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceCommand;
