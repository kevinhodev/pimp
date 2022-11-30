import { useRef, useState } from "react";
import axios from "axios";
import { BsCloudUpload } from "react-icons/bs";
import { AiOutlineFileText } from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { MdOutlineError } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { BsCheck2Circle } from "react-icons/bs";

export default function Importação() {
  const [files, setFiles] = useState([]);
  const [invalidFiles, setInvalidFiles] = useState([]);
  const [loadStatus, setLoadStatus] = useState("");

  const fileInputRef = useRef();

  /** Drag and Drop */
  const [fileIsOver, setFileIsOver] = useState(false);

  const [reports, setReports] = useState([]);

  function handleClick() {
    fileInputRef.current.click();
  }

  function handleInputChange() {
    loadFiles(fileInputRef.current.files);
  }

  function handleFileDragAndDrop(event) {
    event.stopPropagation();
    event.preventDefault();

    switch (event.type) {
      case "dragover": {
        setFileIsOver(true);
        break;
      }
      case "dragleave": {
        setFileIsOver(false);
        break;
      }
      case "drop": {
        loadFiles(event.dataTransfer.files);
        setFileIsOver(false);
        break;
      }
      default:
        break;
    }
  }

  function handleFileDelete() {
    fileInputRef.current.files = null;
    setFiles([]);
  }

  async function handleFileUpload() {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append(file[0].name, file[0]);
    });

    try {
      setLoadStatus("loading");
      const response = await axios.post(
        "http://localhost:3000/titulos",
        formData
      );

      if (response.status === 201) {
        setLoadStatus("analyzing");
        const response = await axios.get("http://localhost:3000/relatorios");

        if (response.status === 200) {
          setReports(response.data.reports);
          setLoadStatus("done");
          handleFileDelete();
        }
      }
    } catch (error) {
      setLoadStatus("error");
    }
  }

  async function loadFiles(files) {
    const newFiles = [];
    const invalidFiles = [];
    const fileReader = new FileReader();

    let promises = Array.from(files).map((file) => {
      return new Promise((resolve) => {
        fileReader.onload = () => resolve([file, fileReader.result]);
        fileReader.readAsText(file);
      });
    });

    const results = await Promise.all(promises);

    results.map((result) => {
      const data = result[1].split("\n");
      const length = data.length - 2;
      const header = data[0];

      if (header.substr(0, 1) !== 0 && header.substr(10, 3) !== "4OP")
        invalidFiles.push(result[0]);
      else {
        newFiles.push([result[0], length]);
      }

      invalidFiles.length > 0
        ? setInvalidFiles(invalidFiles)
        : setFiles(newFiles);
    });
  }

  return (
    <div className="my-60 mx-32 p-5">
      <h2 className="text-center text-4xl font-semibold uppercase">
        Importação
      </h2>
      <div className="relative flex flex-col justify-center items-center m-16">
        <div className="my-8 text-2xl">
          <h4>Análise do arquivo do 7º Ofício</h4>
        </div>
        <div className="flex flex-col justify-center items-center gap-8 min-h-[24rem] w-2/3 p-8 border-[2px] border-dashed border-black rounded-3xl">
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleInputChange}
          />
          <div
            className={`flex flex-col justify-center items-center gap-8 p-8 ${
              fileIsOver ? "bg-slate-200" : "bg-white"
            } w-full cursor-pointer transition-colors`}
            onClick={handleClick}
            onDragOver={handleFileDragAndDrop}
            onDragLeave={handleFileDragAndDrop}
            onDrop={handleFileDragAndDrop}
          >
            <BsCloudUpload className="h-28 w-28" />
            <p className="font-light text-2xl">
              <span className="font-medium border-b border-solid border-black">
                Clique para carregar
              </span>{" "}
              ou arraste e solte o arquivo aqui
            </p>
          </div>
          {files.length > 0 && (
            <>
              <hr className="w-3/4" />
              <h4 className="text-3xl my-4">Arquivo selecionado:</h4>
              <div className="flex flex-col gap-8 w-2/4">
                {files.map((file) => (
                  <div
                    className="flex gap-8 h-32 p-4 border border-solid border-gray-500 rounded-2xl"
                    key={file[0].name}
                  >
                    <AiOutlineFileText className="w-20 h-20 p-2 border border-solid border-zinc-300 rounded-xl" />
                    <div className="flex-1">
                      <p className="m-0 text-2xl">{file[0].name}</p>
                      <p className="text-xl mt-1 mb-0">{file[1]} Títulos</p>
                      <p className="font-light text-xl mt-1 mb-0 opacity-80">
                        {Math.floor(file[0].size / 1000)} KB
                      </p>
                    </div>
                    <TiDeleteOutline
                      className="h-10 w-10 cursor-pointer"
                      onClick={() => handleFileDelete()}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
          <hr className="w-3/4" />
          <button
            className="font-normal text-xl px-3 py-5 w-1/5 rounded-3xl bg-zinc-700 hover:bg-slate-900 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={files.length === 0}
            onClick={handleFileUpload}
          >
            Carregar
          </button>
        </div>
        {invalidFiles.length > 0 && (
          <>
            <div className="absolute top-1/2 left-1/2 z-[150] -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-xl w-[500px] min-h-[25rem] p-6">
              <h2 className="text-3xl text-center text-red-700 font-medium mt-6 mb-3">
                Atenção!
              </h2>
              <p className="text-xl text-center mb-6">
                O seguinte arquivo é invválido e foi descartado:
              </p>
              <div className="flex flex-col gap-8">
                {invalidFiles.map((file) => (
                  <div className="flex gap-8 p-6 border border-solid border-gray-500 rounded-2xl">
                    <AiOutlineFileText className="w-12 h-12 p-2 border border-solid border-zinc-300 rounded-xl" />
                    <div className="flex-1">
                      <p className="m-0 text-xl">{file.name}</p>
                      <p className="font-light text-xl mt-1 mb-0 opacity-80">
                        {Math.floor(file.size / 1000)}KB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <TiDeleteOutline
                className="absolute right-0 top-0 m-2 h-8 w-8 cursor-pointer"
                onClick={() => setInvalidFiles([])}
              />
            </div>
            <div className="fixed inset-0 z-[100] bg-black opacity-10"></div>
          </>
        )}
        {loadStatus !== "" && (
          <>
            <div className="flex flex-col items-center justify-center gap-4 absolute top-1/2 left-1/2 z-[150] -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-xl w-[500px] min-h-[25rem] p-6">
              {loadStatus === "loading" && (
                <>
                  <h2 className="flex items-center gap-4 text-4xl text-center font-normal">
                    Carregando títulos
                    <FaSpinner className="h-8 w-8 fill-zinc-500 animate-spin" />
                  </h2>
                </>
              )}
              {loadStatus === "analyzing" && (
                <>
                  <h2 className="flex items-center gap-4 text-2xl text-center font-normal">
                    Títulos carregados com sucesso!
                    <BsCheck2Circle className="h-8 w-8 fill-green-500" />
                  </h2>
                  <p className="flex items-center gap-4 text-3xl text-center font-normal">
                    Gerando Relatórios
                    <FaSpinner className="h-8 w-8 fill-zinc-500 animate-spin" />
                  </p>
                </>
              )}
              {loadStatus === "done" && (
                <>
                  <h2 className="flex items-center gap-4 text-4xl text-center font-normal">
                    Relatórios gerados com sucesso!
                    <BsCheck2Circle className="h-10 w-10 fill-green-500" />
                  </h2>
                </>
              )}
              {loadStatus === "error" && (
                <>
                  <h2 className="flex items-center gap-4 text-4xl text-center font-normal">
                    Não foi possível carregar os títulos!
                    <MdOutlineError className="h-10 w-10 fill-red-500" />
                  </h2>
                </>
              )}
              {loadStatus === "done" || loadStatus === "error" ? (
                <TiDeleteOutline
                  className="absolute right-0 top-0 m-2 h-9 w-9 cursor-pointer"
                  onClick={() => setLoadStatus("")}
                />
              ) : null}
            </div>
            <div className="fixed inset-0 z-[100] bg-black opacity-10"></div>
          </>
        )}
      </div>
      {Object.keys(reports).length > 0 && (
        <>
          <hr />
          <div className="mt-12 mb-24">
            <h2 className="font-medium text-3xl text-center uppercase tracking-widest">
              Relatórios
            </h2>
            <div>
              <div className="my-12">
                <p className="text-2xl uppercase my-4">
                  Código do Apresentante
                </p>
                <hr />
                <table className="border-collapse border-spacing-0 border border-solid border-[#eee] border-b-2 border-b-[#00cccc] shadow-xl mt-6">
                  <thead className="text-lg">
                    <tr>
                      <th className="py-4 px-5 bg-slate-700 text-white font-semibold uppercase text-left">
                        Código
                      </th>
                      <th className="py-4 px-5 bg-slate-700 text-white font-semibold uppercase text-left">
                        Quantidade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-lg">
                    {reports.códigos.map((código) => (
                      <tr
                        className="cursor-pointer transition-colors even:bg-stone-200 hover:bg-slate-400 hover:text-white"
                        key={código._id}
                      >
                        <td className="p-5">{código._id}</td>
                        <td className="text-center p-5">{código.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="my-12">
                <p className="text-2xl uppercase my-4">Espécies</p>
                <hr />
                <table className="border-collapse border-spacing-0 border border-solid border-[#eee] border-b-2 border-b-[#00cccc] shadow-xl mt-6">
                  <thead className="text-lg">
                    <tr>
                      <th className="py-4 px-5 bg-slate-700 text-white font-semibold uppercase text-left">
                        Espécie
                      </th>
                      <th className="py-4 px-5 bg-slate-700 text-white font-semibold uppercase text-left">
                        Quantidade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-lg">
                    {reports.espécies.map((espécie) => (
                      <tr
                        className="cursor-pointer transition-colors even:bg-stone-200 hover:bg-slate-400 hover:text-white"
                        key={espécie._id}
                      >
                        <td className="p-5">{espécie._id}</td>
                        <td className="text-center p-5">{espécie.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="my-12">
                <p className="text-2xl uppercase my-4">Apresentantes</p>
                <hr />
                <table className="border-collapse border-spacing-0 border border-solid border-[#eee] border-b-2 border-b-[#00cccc] shadow-xl mt-6">
                  <thead className="text-lg">
                    <tr>
                      <th className="py-4 px-5 bg-slate-700 text-white font-semibold uppercase text-left">
                        Nome
                      </th>
                      <th className="py-4 px-5 bg-slate-700 text-white font-semibold uppercase text-left">
                        Quantidade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-lg">
                    {reports.apresentantes.map((apresentante) => (
                      <tr
                        className="cursor-pointer transition-colors even:bg-stone-200 hover:bg-slate-400 hover:text-white"
                        key={apresentante._id}
                      >
                        <td className="p-5">{apresentante._id}</td>
                        <td className="text-center p-5">
                          {apresentante.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {reports.fins.length > 0 && (
                <div className="my-12">
                  <p className="text-2xl uppercase my-4">Fins Falimentares</p>
                  <hr />
                  <table className="border-collapse border-spacing-0 border border-solid border-[#eee] border-b-2 border-b-[#00cccc] shadow-xl mt-6">
                    <thead className="text-lg">
                      <tr>
                        <th className="py-4 px-5 bg-slate-700 text-white font-semibold uppercase text-left">
                          Data
                        </th>
                        <th className="py-4 px-5 bg-slate-700 text-white font-semibold uppercase text-left">
                          Protocolo
                        </th>
                        <th className="py-4 px-5 bg-slate-700 text-white font-semibold uppercase text-left">
                          Código do Apresentante
                        </th>
                        <th className="py-4 px-5 bg-slate-700 text-white font-semibold uppercase text-left">
                          Nome do Apresentante
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-lg">
                      {reports.fins.map((fins) => (
                        <tr
                          className="cursor-pointer transition-colors even:bg-stone-200 hover:bg-slate-400 hover:text-white"
                          key={fins._id}
                        >
                          <td className="p-5">{fins.data}</td>
                          <td className="p-5">{fins.protocolo}</td>
                          <td className="p-5">{fins.apresentante.código}</td>
                          <td className="p-5">{fins.apresentante.nome}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
