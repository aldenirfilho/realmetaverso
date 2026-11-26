# 🔢 Regra de numeração do Diário Oficial

ALDENIR ROCHA DE OLIVEIRA FILHO · PROJETO 360X

Mais de uma sessão de trabalho publica neste site. Em 25/11/2026 duas sessões usaram o mesmo número (nº 023) para atos diferentes. Esta regra evita que aconteça de novo.

## Os cinco passos

1. **Puxe antes de tudo.** `git pull` neste repositório.
2. **Leia o registro.** O próximo número é o seguinte ao maior que aparece em [`numeracao.json`](numeracao.json), contando as reservas.
3. **Reserve antes de redigir.** Acrescente a edição em `numeracao.json` com `"estado": "reservada"`, faça commit e **push na hora**, sozinho, antes de escrever o ato.
4. **Se o push for recusado,** outra sessão chegou antes: puxe de novo e reserve o número seguinte.
5. **Ao publicar,** troque `"reservada"` por `"publicada"`, atualize `ultima_publicada` e envie junto com a edição.

## Outras regras

- Número de edição e número de ato andam juntos e nunca se repetem.
- Reserva que não for publicada em 7 dias pode ser liberada por quem precisar do número; registre `"estado": "liberada"` em vez de apagar a linha.
- **Apostila** (acréscimo autorizado pelo próprio ato, como a da JBL no Ato nº 53) não toma número de edição.
- O registro é só de numeração. O texto das leis continua no Códice Vivo e nas páginas de cada edição.
- O `tools/publicar.py` do repositório do Códice confere este registro antes de copiar: se a última edição do Códice estiver reservada por outra sessão com outro título, ele para.
