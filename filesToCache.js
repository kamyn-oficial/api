const { readdirSync, statSync, existsSync, writeFile } = require('fs')

const listDirSync = (dirPath, fullPath = true) => {
  const dirs = []
  const files = []

  if (!existsSync(dirPath) || !statSync(dirPath).isDirectory()) {
    return { dirs, files }
  }

  const dirContent = readdirSync(dirPath)

  for (const content of dirContent) {
    const path = `${dirPath}/${content}`

    if (statSync(path).isDirectory()) dirs.push(fullPath ? path : content)
    if (statSync(path).isFile()) files.push(fullPath ? path : content)
  }

  return { dirs, files }
}

const filesInDirectoryAndSubs = []

function main(folder) {
  const { dirs, files } = listDirSync(folder)
  filesInDirectoryAndSubs.push(
    ...files.map(file => file.split('src/').join(''))
  )
  if (dirs.length) dirs.forEach(dir => main(dir))
}

main('app/Assets')

writeFile(
  'filesToCache.txt',
  JSON.stringify(filesInDirectoryAndSubs),
  { encoding: 'utf-8' },
  error => {
    if (error) throw error
    console.log('filesToCache.txt criado')
  }
)
