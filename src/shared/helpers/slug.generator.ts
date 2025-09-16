function slugify(id: string): string {
    return id.toLowerCase().replace(/-/g, "");
}

export {slugify};
