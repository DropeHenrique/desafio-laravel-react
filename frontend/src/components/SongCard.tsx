import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { PlayArrow, Visibility, Edit, Delete } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import type { SongCardProps } from '../types';

const SongCard: React.FC<SongCardProps> = ({ 
  song, 
  onEdit, 
  onDelete, 
  onApprove, 
  onReject, 
  isAdmin = false 
}) => {
  const { isAuthenticated } = useAuth();

  // Extrair ID do YouTube da URL
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId: string | null = getYouTubeId(song.youtube_url);
  const thumbnailUrl: string | null = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null;

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const handlePlay = (): void => {
    window.open(song.youtube_url, '_blank');
  };

  const handleEdit = (): void => {
    if (onEdit) {
      onEdit(song);
    }
  };

  const handleDelete = (): void => {
    if (onDelete) {
      onDelete(song);
    }
  };

  const handleApprove = (): void => {
    if (onApprove) {
      onApprove(song);
    }
  };

  const handleReject = (): void => {
    if (onReject) {
      onReject(song);
    }
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        m: 2, 
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        }
      }}
    >
      {thumbnailUrl && (
        <CardMedia
          component="img"
          height="200"
          image={thumbnailUrl}
          alt={song.title}
          sx={{ cursor: 'pointer' }}
          onClick={handlePlay}
        />
      )}
      
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ flex: 1, mr: 1 }}>
            {song.title}
          </Typography>
          {song.position && (
            <Chip 
              label={`#${song.position}`} 
              color="primary" 
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {song.artist}
        </Typography>

        {song.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {song.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Visibility sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              {formatViews(song.views)} visualizações
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Reproduzir">
              <IconButton size="small" onClick={handlePlay}>
                <PlayArrow />
              </IconButton>
            </Tooltip>

            {isAuthenticated && isAdmin && (
              <>
                <Tooltip title="Editar">
                  <IconButton size="small" onClick={handleEdit}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir">
                  <IconButton size="small" onClick={handleDelete}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>

        {!song.is_approved && isAdmin && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Chip 
              label="Pendente" 
              color="warning" 
              size="small"
            />
            <Tooltip title="Aprovar">
              <IconButton 
                size="small" 
                color="success"
                onClick={handleApprove}
              >
                ✓
              </IconButton>
            </Tooltip>
            <Tooltip title="Reprovar">
              <IconButton 
                size="small" 
                color="error"
                onClick={handleReject}
              >
                ✗
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SongCard;
