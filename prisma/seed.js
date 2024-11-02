const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const configSchool = {
    name: "SMK NEGERI 1 LUMBAN JULU",
    about:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam provident odio quod, expedita nisi ea dolore ducimus consequatur velit vel deleniti, perferendis, iste corporis. Enim vero molestiae id obcaecati blanditiis?",
    visionMision:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos consequatur vitae perferendis maiores saepe reprehenderit nihil pariatur quae necessitatibus culpa.",
    address: "Jalan Lintas Sumatera, Aeknatolu Jaya, Kecamatan Lumban Julu",
    telp: "082283020850",
    email: "example@smkn1lumbanjulu.sch.id",
    npsn: "178207732",
    fb: "",
    ig: "",
    tiktok: "",
  };

  await prisma.configSchool.create({
    data: configSchool,
  });
  console.log("Seeding config school completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
