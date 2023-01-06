import AdmZip from "adm-zip";

export const extractFromZip = async (zipPath: string) => {
  const fileNameWithoutExtension = zipPath.split("/").pop()!.split(".").shift()!;
  const directoryPath = `${__dirname}/extracted/${fileNameWithoutExtension}`;

  const zip = new AdmZip(zipPath);

  zip.extractAllTo(directoryPath, true);

  return {
    directoryPath,
  };
};
