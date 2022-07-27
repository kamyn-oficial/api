import edge from 'edge.js'

function renderView(templateName: string, state: any): Promise<string> {
  edge.mount(__dirname)

  return edge.render(templateName, state)
}

export default renderView
