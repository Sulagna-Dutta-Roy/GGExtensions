function trans(latex) {
  let lines = latex.trim().split("\n")

  // 1.去除注释
  //过滤直接以%开头的行
  lines = lines.filter(l => !l.startsWith("%"))

  //检查每一行，查看行内是否有注释
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    for (let j = 0; j < line.length; j++) {
      if (j >= 1 && line[j] === "%" && line[j - 1] !== "\\") {
        lines[i] = line.substring(0, j)
        break
      }
    }
  }

  //2.段落变成整个文本
  let text = lines.join("\n")

  // 数学百分号替换 \%=>%
  text = text.replaceAll("\\%", "%")

  let tmp = handle_cite_ref(text)
  text = tmp[0]
  let mapping = tmp[1]
  // let mapping =[]


  //将\t变为空格
  text = text.replaceAll("\t", " ")
  //缩减空格2=>1
  let cur_len = text.length
  while (true) {
    text = text.replaceAll("  ", " ")
    if (text.length === cur_len) {
      break //长度未变化，退出循环
    } else {
      cur_len = text.length
    }
  }

  // console.log([text, mapping])
  return [text, mapping]
}


function handle_cite_ref(text) {
  //寻找可替换的
  const cite_arr = findall(/~\\cite{.*?}/g, text)
  const cite_arr2 = findall(/~\\shortcite{.*?}/g, text)
  const ref_arr = findall(/~\\ref{.*?}/g, text)
  const cref_arr = findall(/~\\cref{.*?}/g, text)
  const equ_arr = findall(/\$.*?\$/g, text)
  const mapping = [...cite_arr, ...cite_arr2, ...ref_arr, ...cref_arr, ...equ_arr]
  const new_text = do_replace(mapping, text)
  return [new_text, mapping]
}

function do_replace(full_arr, text) {
  for (let i = 0; i < full_arr.length; i++) {
    let template = full_arr[i]
    text = text.replace(template, `[${i}]`)
  }
  return text
}


function findall(regex, text) {
  return [...text.matchAll(regex)].map(arr => arr[0])
}


function go_back(text, mapping) {
  if (!mapping) {
    console.error("error mapping array！", mapping)
    return text
  }

  // 1.数学百分号
  text = text.replaceAll("%", "\\%")
  //2.引用、公式符号
  text = replace_back(text, mapping)
  return text
}


function replace_back(text, mapping_arr) {
  for (let i = 0; i < mapping_arr.length; i++) {
    text = text.replace(`[${i}]`, mapping_arr[i])
  }
  return text
}




