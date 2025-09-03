import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Pagination,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import SongCard from '../components/SongCard';
import SongForm from '../components/SongForm';
import { songService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { SongsResponse, Song } from '../types';

const Home: React.FC = () => {
  const [songs, setSongs] = useState<SongsResponse>({
    top_five: [],
    paginated: { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  const fetchSongs = async (page: number = 1): Promise<void> => {
    try {
      setLoading(true);
      const response = await songService.getAll();
      setSongs(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar músicas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleFormSuccess = (): void => {
    fetchSongs();
  };

  const handleEdit = (song: Song): void => {
    // Implementar edição
    console.log('Editar música:', song);
  };

  const handleDelete = async (song: Song): Promise<void> => {
    if (window.confirm('Tem certeza que deseja excluir esta música?')) {
      try {
        await songService.delete(song.id);
        fetchSongs();
      } catch (err) {
        setError('Erro ao excluir música');
      }
    }
  };

  const handleApprove = async (song: Song): Promise<void> => {
    try {
      await songService.approve(song.id);
      fetchSongs();
    } catch (err) {
      setError('Erro ao aprovar música');
    }
  };

  const handleReject = async (song: Song): Promise<void> => {
    try {
      await songService.reject(song.id);
      fetchSongs();
    } catch (err) {
      setError('Erro ao reprovar música');
    }
  };

  const handleFormOpen = (): void => {
    setFormOpen(true);
  };

  const handleFormClose = (): void => {
    setFormOpen(false);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number): void => {
    fetchSongs(page);
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
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Top 5 Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          🎵 Top 5 Músicas Mais Tocadas 🎵
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom align="center" sx={{ mb: 4, color: 'text.secondary' }}>
          Tião Carreiro e Pardinho
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          justifyContent: 'center',
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
              isAdmin={isAuthenticated}
            />
          ))}
        </Box>
      </Box>

      {/* Additional Songs Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Mais Músicas
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleFormOpen}
          >
            Sugerir Música
          </Button>
        </Box>

        {songs.paginated.data.length > 0 ? (
          <>
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
                  isAdmin={isAuthenticated}
                />
              ))}
            </Box>

            {songs.paginated.last_page > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={songs.paginated.last_page}
                  page={songs.paginated.current_page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            Nenhuma música adicional encontrada.
          </Typography>
        )}
      </Box>

      <SongForm
        open={formOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </Container>
  );
};

export default Home;
