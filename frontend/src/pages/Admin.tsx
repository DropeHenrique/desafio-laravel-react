import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import SongCard from '../components/SongCard';
import SongForm from '../components/SongForm';
import { songService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { SongsResponse, Song } from '../types';

const Admin: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [songs, setSongs] = useState<SongsResponse>({
    top_five: [],
    paginated: { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 }
  });
  const [pendingSongs, setPendingSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, navigate]);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [songsResponse, pendingResponse] = await Promise.all([
        songService.getAll(),
        songService.getPending()
      ]);
      
      setSongs(songsResponse.data);
      setPendingSongs(pendingResponse.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue);
  };

  const handleFormSuccess = (): void => {
    fetchData();
  };

  const handleEdit = (song: Song): void => {
    setEditingSong(song);
    setFormOpen(true);
  };

  const handleDelete = async (song: Song): Promise<void> => {
    if (window.confirm('Tem certeza que deseja excluir esta música?')) {
      try {
        await songService.delete(song.id);
        fetchData();
      } catch (err) {
        setError('Erro ao excluir música');
      }
    }
  };

  const handleApprove = async (song: Song): Promise<void> => {
    try {
      await songService.approve(song.id);
      fetchData();
    } catch (err) {
      setError('Erro ao aprovar música');
    }
  };

  const handleReject = async (song: Song): Promise<void> => {
    try {
      await songService.reject(song.id);
      fetchData();
    } catch (err) {
      setError('Erro ao reprovar música');
    }
  };

  const handleCloseForm = (): void => {
    setFormOpen(false);
    setEditingSong(null);
  };

  const handleFormOpen = (): void => {
    setFormOpen(true);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Administração
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
          <Tab label="Todas as Músicas" />
          <Tab label="Pendentes de Aprovação" />
        </Tabs>
      </Paper>

      {tabValue === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Todas as Músicas
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleFormOpen}
            >
              Adicionar Música
            </Button>
          </Box>

          {/* Top 5 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Top 5
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3,
              '& > *': { 
                flex: '0 0 calc(20% - 24px)',
                minWidth: '280px',
                '@media (max-width: 1200px)': { flex: '0 0 calc(25% - 24px)' },
                '@media (max-width: 900px)': { flex: '0 0 calc(33.333% - 24px)' },
                '@media (max-width: 600px)': { flex: '0 0 calc(50% - 24px)' },
                '@media (max-width: 400px)': { flex: '0 0 100%' }
              }
            }}>
              {songs.top_five.map((song) => (
                <SongCard 
                  key={song.id}
                  song={song} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isAdmin={true}
                />
              ))}
            </Box>
          </Box>

          {/* Outras músicas */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Outras Músicas
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3,
              '& > *': { 
                flex: '0 0 calc(25% - 24px)',
                minWidth: '280px',
                '@media (max-width: 1200px)': { flex: '0 0 calc(33.333% - 24px)' },
                '@media (max-width: 900px)': { flex: '0 0 calc(50% - 24px)' },
                '@media (max-width: 600px)': { flex: '0 0 100%' }
              }
            }}>
              {songs.paginated.data.map((song) => (
                <SongCard 
                  key={song.id}
                  song={song} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isAdmin={true}
                />
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Músicas Pendentes de Aprovação
          </Typography>
          
          {pendingSongs.length > 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3,
              '& > *': { 
                flex: '0 0 calc(25% - 24px)',
                minWidth: '280px',
                '@media (max-width: 1200px)': { flex: '0 0 calc(33.333% - 24px)' },
                '@media (max-width: 900px)': { flex: '0 0 calc(50% - 24px)' },
                '@media (max-width: 600px)': { flex: '0 0 100%' }
              }
            }}>
              {pendingSongs.map((song) => (
                <SongCard 
                  key={song.id}
                  song={song} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isAdmin={true}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
              Nenhuma música pendente de aprovação.
            </Typography>
          )}
        </Box>
      )}

      <SongForm
        open={formOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        song={editingSong}
        isEdit={!!editingSong}
      />
    </Container>
  );
};

export default Admin;
