import BaseTranslator from "./BaseTranslator";
import { Sprint } from "@cto-dashboard-model/cto-dashboard-model";

export default class SprintTranslator
  implements BaseTranslator<JiraSprint, Sprint>
{
  translate(data: JiraSprint): Sprint {
    return {
      id: data.id,
      name: data.name,
      boardId: data.originBoardId,
    }
  }
  translateMulti(data: JiraSprint[]): Sprint[] {
    return data.map(d => this.translate(d))
  }
}
