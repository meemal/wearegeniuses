import React, { useState } from 'react';
import { createTestProfiles, deleteTestProfiles } from '../utils/createTestProfiles';

const TestProfileManager = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState('');

  const handleCreateProfiles = async () => {
    try {
      setIsCreating(true);
      setStatus('Creating test profiles...');
      const createdProfiles = await createTestProfiles();
      setStatus(`Successfully created ${createdProfiles.length} test profiles`);
    } catch (error) {
      setStatus(`Error creating profiles: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProfiles = async () => {
    try {
      setIsDeleting(true);
      setStatus('Deleting test profiles...');
      await deleteTestProfiles();
      setStatus('Successfully deleted all test profiles');
    } catch (error) {
      setStatus(`Error deleting profiles: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Test Profile Manager</h3>
        
        {status && (
          <div className="text-sm text-gray-600 mb-2">
            {status}
          </div>
        )}
        
        <div className="space-x-2">
          <button
            onClick={handleCreateProfiles}
            disabled={isCreating || isDeleting}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isCreating ? 'Creating...' : 'Create Test Profiles'}
          </button>
          
          <button
            onClick={handleDeleteProfiles}
            disabled={isCreating || isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Test Profiles'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestProfileManager; 