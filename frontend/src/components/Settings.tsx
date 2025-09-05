import React, { useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';
import { Setting } from '../types';

interface SettingFormData {
  name: string;
  value: string;
  description: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [formData, setFormData] = useState<SettingFormData>({
    name: '',
    value: '',
    description: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await settingsAPI.getAll();
      setSettings(response.data);
    } catch (err) {
      setError('Ошибка при загрузке настроек');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const settingData = {
        name: formData.name,
        value: parseFloat(formData.value),
        description: formData.description
      };
      
      if (editingSetting) {
        await settingsAPI.update(editingSetting.id, settingData);
      } else {
        await settingsAPI.create(settingData);
      }
      await fetchSettings();
      resetForm();
    } catch (err) {
      setError('Ошибка при сохранении настройки');
      console.error(err);
    }
  };

  const handleEdit = (setting: Setting): void => {
    setEditingSetting(setting);
    setFormData({
      name: setting.name,
      value: setting.value.toString(),
      description: setting.description
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Вы уверены, что хотите удалить эту настройку?')) {
      try {
        await settingsAPI.delete(id);
        await fetchSettings();
      } catch (err) {
        setError('Ошибка при удалении настройки');
        console.error(err);
      }
    }
  };

  const resetForm = (): void => {
    setFormData({
      name: '',
      value: '',
      description: ''
    });
    setEditingSetting(null);
    setShowForm(false);
  };

  const addDefaultSettings = async (): Promise<void> => {
    const defaultSettings = [
      {
        name: 'markup',
        value: 30,
        description: 'Наценка в процентах (например, 30 для 30%)'
      },
      {
        name: 'labor_cost',
        value: 100,
        description: 'Стоимость рабочей силы за час (в рублях)'
      },
      {
        name: 'overhead',
        value: 15,
        description: 'Накладные расходы в процентах'
      }
    ];

    try {
      for (const setting of defaultSettings) {
        await settingsAPI.create(setting);
      }
      await fetchSettings();
    } catch (err) {
      setError('Ошибка при добавлении настроек по умолчанию');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка настроек...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>Настройки системы</h2>
        
        {error && <div className="error">{error}</div>}
        
        <div style={{ marginBottom: '1rem' }}>
          <button 
            className="btn btn-success" 
            onClick={() => setShowForm(true)}
            style={{ marginRight: '1rem' }}
          >
            Добавить настройку
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={addDefaultSettings}
          >
            Добавить настройки по умолчанию
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
            <h3>{editingSetting ? 'Редактировать настройку' : 'Добавить новую настройку'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название настройки</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                  placeholder="например: markup, labor_cost"
                  required
                />
              </div>
              <div className="form-group">
                <label>Значение</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, value: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="Описание назначения настройки"
                />
              </div>
              <div>
                <button type="submit" className="btn">
                  {editingSetting ? 'Обновить' : 'Добавить'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#e8f4fd', borderRadius: '8px' }}>
          <h4>Предустановленные настройки:</h4>
          <ul style={{ marginTop: '0.5rem' }}>
            <li><strong>markup</strong> - Наценка в процентах (например, 30 для 30%)</li>
            <li><strong>labor_cost</strong> - Стоимость рабочей силы за час (в рублях)</li>
            <li><strong>overhead</strong> - Накладные расходы в процентах</li>
          </ul>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Значение</th>
              <th>Описание</th>
              <th>Обновлено</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {settings.map(setting => (
              <tr key={setting.id}>
                <td><strong>{setting.name}</strong></td>
                <td>{setting.value}</td>
                <td>{setting.description}</td>
                <td>{new Date(setting.updated_at).toLocaleDateString('ru-RU')}</td>
                <td>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleEdit(setting)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(setting.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {settings.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
            Настройки не добавлены. Нажмите "Добавить настройки по умолчанию" для начала работы.
          </p>
        )}
      </div>
    </div>
  );
};

export default Settings;
