import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { songService } from '../services/api';
import { useValidation } from '../hooks/useValidation';
import { toast } from 'react-toastify';
import type { SongFormProps, SongFormData } from '../types';

const SongForm: React.FC<SongFormProps> = ({ 
  open, 
  onClose, 
  onSuccess, 
  song = null, 
  isEdit = false 
}) => {
  const [formData, setFormData] = useState<SongFormData>({
    title: '',
    artist: '',
    youtube_url: '',
    description: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { errors, setErrors, clearErrors, getFieldError, hasFieldError } = useValidation();

  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title,
        artist: song.artist,
        youtube_url: song.youtube_url,
        description: song.description || '',
      });
    } else {
      setFormData({
        title: '',
        artist: '',
        youtube_url: '',
        description: '',
      });
    }
  }, [song, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (hasFieldError(name)) {
      clearErrors();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');
    clearErrors();

    try {
      if (isEdit && song) {
        await songService.update(song.id, formData);
        toast.success('Música atualizada com sucesso!');
      } else {
        await songService.create(formData);
        toast.success('Música sugerida com sucesso!');
      }
      
      onSuccess();
      onClose();
      resetForm();
    } catch (err: any) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
        toast.error('Erro de validação. Verifique os campos abaixo.');
      } else {
        setError(err.response?.data?.message || 'Erro ao salvar música');
        toast.error(err.response?.data?.message || 'Erro ao salvar música');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (): void => {
    setFormData({
      title: '',
      artist: '',
      youtube_url: '',
      description: '',
    });
  };

  const handleClose = (): void => {
    resetForm();
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? 'Editar Música' : 'Sugerir Nova Música'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="title"
              label="Título da Música"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              error={hasFieldError('title')}
              helperText={getFieldError('title')}
            />
            
            <TextField
              name="artist"
              label="Artista"
              value={formData.artist}
              onChange={handleChange}
              required
              fullWidth
              error={hasFieldError('artist')}
              helperText={getFieldError('artist')}
            />
            
            <TextField
              name="youtube_url"
              label="URL do YouTube"
              value={formData.youtube_url}
              onChange={handleChange}
              required
              fullWidth
              placeholder="https://www.youtube.com/watch?v=..."
              error={hasFieldError('youtube_url')}
              helperText={getFieldError('youtube_url')}
            />
            
            <TextField
              name="description"
              label="Descrição (opcional)"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              error={hasFieldError('description')}
              helperText={getFieldError('description')}
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Sugerir')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SongForm;
