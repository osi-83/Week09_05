import { useState, useEffect } from 'react';
import './style/tarefas.css';
import NovaTarefa from './novatarefa';
import Progresso from './progresso';

export interface Tarefa {
  id: number;
  descricao: string;
  periodo: string;
  concluida: boolean;
}

const STORAGE_KEY = 'minhas_tarefas';

const Tarefas: React.FC = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  useEffect(() => {
  try {
    const tarefasSalvas = localStorage.getItem(STORAGE_KEY);
    if (tarefasSalvas) {
      setTarefas(JSON.parse(tarefasSalvas));
    }
  } catch (error) {
    console.error("Erro ao acessar o localStorage:", error);
  }
}, []);

  useEffect(() => {
  if (tarefas.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
  }
}, [tarefas]);

  const adicionarTarefa = (nova: { descricao: string; periodo: string }) => {
    const novaTarefa: Tarefa = {
      id: Date.now(),
      descricao: nova.descricao,
      periodo: nova.periodo,
      concluida: false,
    };
    setTarefas((prev) => [...prev, novaTarefa]);
  };

  const alternarConclusao = (id: number) => {
    setTarefas((prev) =>
      prev.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  };

  const tarefasPorPeriodo = (periodo: string) =>
    tarefas.filter((t) => t.periodo === periodo);

  const totalConcluidas = tarefas.filter((t) => t.concluida).length;

  return (
    <div className="tarefas">
      <h2><em>Lista de tarefas</em></h2>
      <NovaTarefa onAdicionarTarefa={adicionarTarefa} />

      <Progresso total={tarefas.length} concluidas={totalConcluidas} />

      <p><strong>Total de tarefas concluídas: {totalConcluidas}</strong></p>

      <div className="colunas">
        {['Manhã', 'Tarde', 'Noite'].map((periodo) => (
          <div className="coluna" key={periodo}>
            <h3>{periodo}</h3>
            <ul>
              {tarefasPorPeriodo(periodo).map((tarefa) => (
                <li key={tarefa.id}>
                  <label
                    style={{
                      textDecoration: tarefa.concluida ? 'line-through' : 'none',
                      color: tarefa.concluida ? '#aaa' : '#000',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={tarefa.concluida}
                      onChange={() => alternarConclusao(tarefa.id)}
                      style={{ marginRight: '8px' }}
                    />
                    {tarefa.descricao}
                  </label>
                </li>
              ))}
            </ul>
            <p>
              Concluídas: {tarefasPorPeriodo(periodo).filter((t) => t.concluida).length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tarefas;