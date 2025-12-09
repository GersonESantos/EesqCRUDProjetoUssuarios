import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    documento: '',
    senha: '',
    sexo: '',
    data_nasc: '',
    endereco: '',
    cidade: '',
    estado: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Usuário cadastrado com sucesso!');
        // Limpar formulário
        setFormData({
          nome: '', email: '', telefone: '', documento: '', senha: '',
          sexo: '', data_nasc: '', endereco: '', cidade: '', estado: '',
        });
      } else {
        alert(`Erro: ${result.error}`);
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="title">Cadastro de Usuários</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" name="nome" placeholder="Nome Completo" value={formData.nome} onChange={handleChange} required />
            <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <input type="tel" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} />
            <input type="text" name="documento" placeholder="Documento (CPF)" value={formData.documento} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} required />
            <select name="sexo" value={formData.sexo} onChange={handleChange}>
              <option value="">Selecione o Sexo</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </div>
           <div className="input-group">
            <input type="date" name="data_nasc" placeholder="Data de Nascimento" value={formData.data_nasc} onChange={handleChange} />
          </div>
          <input type="text" name="endereco" placeholder="Endereço" value={formData.endereco} onChange={handleChange} />
          <div className="input-group">
            <input type="text" name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleChange} />
            <input type="text" name="estado" placeholder="Estado (UF)" maxLength="2" value={formData.estado} onChange={handleChange} />
          </div>
          <button type="submit" className="submit-btn">Enviar</button>
        </form>
      </div>
    </div>
  );
}

export default App;
