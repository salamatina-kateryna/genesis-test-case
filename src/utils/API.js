class API {
  baseURL = "https://api.wisey.app";
  constructor(options = {}) {
    const { version } = options;
    this.options = {
      version: version || "api/v1",
    };
    this.url = `${this.baseURL}/${this.options.version}`;
  }

  async fetch(path = "/", params = {}) {
    if (!this.token) {
      this.token = (
        await fetch(`${this.url}/auth/anonymous?platform=subscriptions`).then(
          (x) => x.json()
        )
      )?.token;
    }
    const res = await fetch(`${this.url}${path}`, {
      ...params,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return res.json();
  }

  async getCourses() {
    const courses = await this.fetch("/core/preview-courses");
    return courses?.courses;
  }

  async getCourse(courseId) {
    const courses = await this.fetch(`/core/preview-courses/${courseId}`);
    return courses;
  }
}

export default API;
