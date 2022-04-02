class ArrayService {
  sortVideosByIdDesc(videoList) {
    return videoList.sort((v1, v2) => v2.id - v1.id);
  }
}

module.exports = new ArrayService();
